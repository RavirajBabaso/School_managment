import { Op, Transaction, WhereOptions } from 'sequelize';
import { sequelize } from '../config/database';
import {
  Department,
  Notification,
  Task,
  TaskHistory,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskPriority,
  TaskStatus,
  User
} from '../models';
import { emitToAll, emitToUser } from '../config/socket';
import { sendTaskAssignedEmail } from './emailService';

export interface TaskFilterOptions {
  assigned_to?: number;
  department_id?: number;
  from?: string | Date;
  status?: TaskStatus | string;
  to?: string | Date;
  priority?: TaskPriority;
}

export interface CreateTaskPayload {
  assigned_to: number;
  attachment_path?: string | null;
  department_id?: number | null;
  description?: string | null;
  due_date: string | Date;
  priority: TaskPriority;
  start_date?: string | Date;
  title: string;
}

export interface UpdateTaskPayload {
  assigned_to?: number;
  attachment_path?: string | null;
  comment?: string | null;
  completed_at?: Date | null;
  department_id?: number | null;
  description?: string | null;
  due_date?: string | Date;
  priority?: TaskPriority;
  start_date?: string | Date;
  status?: TaskStatus;
  title?: string;
}

const taskListInclude = [
  {
    model: User,
    as: 'assignedBy',
    attributes: ['id', 'name', 'email', 'role']
  },
  {
    model: User,
    as: 'assignedTo',
    attributes: ['id', 'name', 'email', 'role', 'department_id']
  },
  {
    model: Department,
    as: 'department',
    attributes: ['id', 'name', 'description']
  }
];

const historyInclude = [
  {
    model: TaskHistory,
    as: 'history',
    include: [
      {
        model: User,
        as: 'updatedBy',
        attributes: ['id', 'name']
      }
    ]
  }
];

const isTaskPriority = (value: unknown): value is TaskPriority =>
  typeof value === 'string' && TASK_PRIORITIES.includes(value as TaskPriority);

const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === 'string' && TASK_STATUSES.includes(value as TaskStatus);

const createNotification = async (
  userId: number,
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'TASK_DELAYED' | 'TASK_ESCALATED',
  message: string,
  taskId: number,
  transaction?: Transaction
) => {
  const notification = await Notification.create(
    {
      user_id: userId,
      type,
      message,
      task_id: taskId,
      is_read: false
    } as Notification,
    { transaction }
  );

  // Emit real-time notification
  emitToUser(userId, 'notification:new', {
    id: notification.id,
    type,
    message,
    task_id: taskId,
    created_at: notification.created_at,
  });

  return notification;
};

const buildWhereClause = (filters: TaskFilterOptions) => {
  const where: WhereOptions<Task> = {};

  if (filters.status) {
    const statuses = String(filters.status)
      .split(',')
      .map((status) => status.trim())
      .filter(Boolean);

    if (statuses.length > 1) {
      (where as Record<string, unknown>).status = { [Op.in]: statuses as TaskStatus[] };
    } else {
      where.status = statuses[0] as TaskStatus;
    }
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.department_id) {
    where.department_id = filters.department_id;
  }

  if (filters.assigned_to) {
    where.assigned_to = filters.assigned_to;
  }

  if (filters.from || filters.to) {
    const dueDateFilter: Record<symbol, Date> = {} as Record<symbol, Date>;

    if (filters.from) {
      dueDateFilter[Op.gte] = new Date(filters.from);
    }

    if (filters.to) {
      dueDateFilter[Op.lte] = new Date(filters.to);
    }

    (where as Record<string, unknown>).due_date = dueDateFilter;
  }

  return where;
};

export const createTask = async (data: CreateTaskPayload, createdBy: number) => {
  const task = await sequelize.transaction(async (transaction) => {
    const createdTask = await Task.create(
      {
        title: data.title,
        description: data.description ?? null,
        assigned_by: createdBy,
        assigned_to: data.assigned_to,
        department_id: data.department_id ?? null,
        priority: data.priority,
        status: 'PENDING',
        start_date: data.start_date ? new Date(data.start_date) : new Date(),
        due_date: new Date(data.due_date),
        attachment_path: data.attachment_path ?? null,
        completed_at: null
      } as Task,
      { transaction }
    );

    await TaskHistory.create(
      {
        task_id: createdTask.id,
        updated_by: createdBy,
        old_status: null,
        new_status: 'PENDING',
        comment: 'Task created'
      } as TaskHistory,
      { transaction }
    );

    await createNotification(
      createdTask.assigned_to,
      'TASK_ASSIGNED',
      `New task assigned: ${createdTask.title}`,
      createdTask.id,
      transaction
    );

    // Send email notification (outside transaction for reliability)
    try {
      const assignedUser = await User.findByPk(createdTask.assigned_to);
      const creatorUser = await User.findByPk(createdBy);

      if (assignedUser?.email && creatorUser) {
        await sendTaskAssignedEmail(
          assignedUser.email,
          createdTask.title,
          createdTask.due_date,
          creatorUser.name
        );
      }
    } catch (emailError) {
      console.error('Failed to send task assignment email:', emailError);
      // Don't fail the task creation if email fails
    }

    return getTaskById(createdTask.id, transaction);
  });

  emitToAll('task:updated', task);
  return task;
};

export const updateTaskStatus = async (
  taskId: number,
  newStatus: TaskStatus,
  updatedBy: number,
  comment?: string | null,
  attachmentPath?: string | null
) => {
  const task = await sequelize.transaction(async (transaction) => {
    const existingTask = await Task.findByPk(taskId, { transaction });

    if (!existingTask) {
      return null;
    }

    const oldStatus = existingTask.status;
    existingTask.status = newStatus;
    existingTask.completed_at = newStatus === 'COMPLETED' ? new Date() : null;

    if (attachmentPath !== undefined) {
      existingTask.attachment_path = attachmentPath;
    }

    await existingTask.save({ transaction });

    await TaskHistory.create(
      {
        task_id: existingTask.id,
        updated_by: updatedBy,
        old_status: oldStatus,
        new_status: newStatus,
        comment: comment ?? null
      } as TaskHistory,
      { transaction }
    );

    const notificationType =
      newStatus === 'DELAYED'
        ? 'TASK_DELAYED'
        : newStatus === 'ESCALATED'
          ? 'TASK_ESCALATED'
          : 'TASK_UPDATED';

    await createNotification(
      existingTask.assigned_to,
      notificationType,
      `Task "${existingTask.title}" updated to ${newStatus}`,
      existingTask.id,
      transaction
    );

    return getTaskById(existingTask.id, transaction);
  });

  if (task) {
    emitToAll('task:updated', task);
  }

  return task;
};

export const getTasksWithFilters = async (filters: TaskFilterOptions) => {
  return Task.findAll({
    where: buildWhereClause(filters),
    include: [...taskListInclude],
    order: [['due_date', 'ASC']]
  });
};

export const getTaskById = async (id: number, transaction?: Transaction) => {
  return Task.findByPk(id, {
    include: [
      ...taskListInclude,
      {
        ...historyInclude[0],
        separate: true,
        order: [['updated_at', 'ASC'] as const]
      }
    ],
    transaction
  });
};

export const updateTask = async (taskId: number, updates: UpdateTaskPayload, updatedBy: number) => {
  const task = await sequelize.transaction(async (transaction) => {
    const existingTask = await Task.findByPk(taskId, { transaction });

    if (!existingTask) {
      return null;
    }

    const previousStatus = existingTask.status;

    if (updates.title !== undefined) {
      existingTask.title = updates.title;
    }

    if (updates.description !== undefined) {
      existingTask.description = updates.description ?? null;
    }

    if (updates.assigned_to !== undefined) {
      existingTask.assigned_to = updates.assigned_to;
    }

    if (updates.department_id !== undefined) {
      existingTask.department_id = updates.department_id ?? null;
    }

    if (updates.priority !== undefined) {
      existingTask.priority = updates.priority;
    }

    if (updates.start_date !== undefined) {
      existingTask.start_date = new Date(updates.start_date);
    }

    if (updates.due_date !== undefined) {
      existingTask.due_date = new Date(updates.due_date);
    }

    if (updates.attachment_path !== undefined) {
      existingTask.attachment_path = updates.attachment_path ?? null;
    }

    if (updates.status !== undefined) {
      existingTask.status = updates.status;
      existingTask.completed_at =
        updates.status === 'COMPLETED'
          ? updates.completed_at ?? new Date()
          : updates.completed_at ?? null;
    }

    await existingTask.save({ transaction });

    const statusChanged = updates.status !== undefined && previousStatus !== existingTask.status;
    const comment = updates.comment ?? null;
    const attachmentChanged = updates.attachment_path !== undefined;
    const coreFieldChanged =
      updates.title !== undefined ||
      updates.description !== undefined ||
      updates.assigned_to !== undefined ||
      updates.department_id !== undefined ||
      updates.priority !== undefined ||
      updates.start_date !== undefined ||
      updates.due_date !== undefined;

    if (statusChanged || comment || attachmentChanged || coreFieldChanged) {
      await TaskHistory.create(
        {
          task_id: existingTask.id,
          updated_by: updatedBy,
          old_status: statusChanged ? previousStatus : existingTask.status,
          new_status: existingTask.status,
          comment
        } as TaskHistory,
        { transaction }
      );

      const notificationType =
        existingTask.status === 'DELAYED'
          ? 'TASK_DELAYED'
          : existingTask.status === 'ESCALATED'
            ? 'TASK_ESCALATED'
            : 'TASK_UPDATED';

      await createNotification(
        existingTask.assigned_to,
        notificationType,
        `Task "${existingTask.title}" has been updated`,
        existingTask.id,
        transaction
      );
    }

    return getTaskById(existingTask.id, transaction);
  });

  if (task) {
    emitToAll('task:updated', task);
  }

  return task;
};

export const checkAndFlagDelayedTasks = async () => {
  const delayedTaskCount = await sequelize.transaction(async (transaction) => {
    const delayedTasks = await Task.findAll({
      where: {
        status: {
          [Op.notIn]: ['COMPLETED', 'DELAYED']
        },
        due_date: {
          [Op.lt]: new Date()
        }
      },
      transaction
    });

    for (const task of delayedTasks) {
      const previousStatus = task.status;
      task.status = 'DELAYED';
      await task.save({ transaction });

      await TaskHistory.create(
        {
          task_id: task.id,
          updated_by: task.assigned_by,
          old_status: previousStatus,
          new_status: 'DELAYED',
          comment: 'Task automatically flagged as delayed'
        } as TaskHistory,
        { transaction }
      );

      await createNotification(
        task.assigned_to,
        'TASK_DELAYED',
        `Task "${task.title}" is delayed`,
        task.id,
        transaction
      );
    }

    return delayedTasks.length;
  });

  if (delayedTaskCount > 0) {
    const delayedTasks = await Task.findAll({
      where: {
        status: 'DELAYED',
        due_date: {
          [Op.lt]: new Date()
        }
      }
    });

    delayedTasks.forEach((task) => emitToAll('task:updated', task));
  }

  return delayedTaskCount;
};

export const validateTaskFilters = (filters: TaskFilterOptions) => {
  if (filters.priority && !isTaskPriority(filters.priority)) {
    throw new Error('Invalid task priority');
  }

  if (
    filters.status &&
    !String(filters.status)
      .split(',')
      .map((status) => status.trim())
      .filter(Boolean)
      .every(isTaskStatus)
  ) {
    throw new Error('Invalid task status');
  }
};
