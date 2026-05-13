import { Op } from 'sequelize';
import { Department, Task, User } from '../models';

const safePercentage = (part: number, total: number) =>
  total === 0 ? 0 : Number(((part / total) * 100).toFixed(2));

interface ITAnalytics {
  completionRate: number;
  delayPercentage: number;
  erpEfficiency: number;
  taskDistribution: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    delayed: number;
  };
  infrastructureManagement: {
    systemsMaintained: number;
    issuesResolved: number;
    uptimePercentage: number;
  };
  staffPerformance: Array<{
    staff: string;
    score: number;
    completed: number;
    delayed: number;
    total: number;
  }>;
  monthlyPerformance: Array<{
    month: string;
    completed: number;
    delayed: number;
    total: number;
  }>;
}

export const getITAnalytics = async (itId: number): Promise<ITAnalytics> => {
  try {
    const tasks = await Task.findAll({
      where: { assigned_to: itId },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'role']
        }
      ],
      order: [['due_date', 'ASC']]
    });

    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'COMPLETED').length;
    const delayed = tasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length;
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
    const pending = tasks.filter((task) => task.status === 'PENDING').length;

    const staffPerformance = tasks.reduce<Record<string, { completed: number; delayed: number; total: number }>>(
      (acc, task) => {
        const staff = task.assignedBy?.name ?? 'Management';
        const current = acc[staff] ?? { completed: 0, delayed: 0, total: 0 };
        current.total += 1;
        current.completed += task.status === 'COMPLETED' ? 1 : 0;
        current.delayed += task.status === 'DELAYED' || task.status === 'ESCALATED' ? 1 : 0;
        acc[staff] = current;
        return acc;
      },
      {}
    );

    const monthlyPerformance = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const month = date.toLocaleString('en', { month: 'short' });
      const monthTasks = tasks.filter((task) => {
        const due = new Date(task.due_date);
        return due.getMonth() === date.getMonth() && due.getFullYear() === date.getFullYear();
      });
      return {
        month,
        completed: monthTasks.filter((task) => task.status === 'COMPLETED').length,
        delayed: monthTasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length,
        total: monthTasks.length
      };
    });

    const systemsMaintained = completed;
    const issuesResolved = completed + delayed;
    const uptimePercentage = safePercentage(systemsMaintained, systemsMaintained + issuesResolved) * 20;

    console.log(`IT Analytics for user ${itId}: total=${total}, completed=${completed}, delayed=${delayed}, inProgress=${inProgress}, pending=${pending}`);

    return {
      completionRate: safePercentage(completed, total),
      delayPercentage: safePercentage(delayed, total),
      erpEfficiency: Number((safePercentage(completed, total) - safePercentage(delayed, total) * 0.2).toFixed(2)),
      taskDistribution: { total, pending, inProgress, completed, delayed },
      infrastructureManagement: {
        systemsMaintained,
        issuesResolved,
        uptimePercentage
      },
      staffPerformance: Object.entries(staffPerformance).map(([staff, value]) => ({
        staff,
        score: Math.max(0, Number((safePercentage(value.completed, value.total) - value.delayed * 10).toFixed(2))),
        ...value
      })),
      monthlyPerformance
    };
  } catch (error) {
    console.error(`Error fetching IT analytics for user ${itId}:`, error);
    throw error;
  }
};

export const getITDelayAlerts = async (itId: number) => {
  try {
    const now = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 3);

    const tasks = await Task.findAll({
      where: {
        assigned_to: itId,
        status: { [Op.ne]: 'COMPLETED' },
        due_date: { [Op.lte]: soon }
      },
      include: [
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name']
        }
      ],
      order: [['due_date', 'ASC']]
    });

    const alerts = tasks.map((task) => {
      const due = new Date(task.due_date);
      const overdue = due < now || task.status === 'DELAYED' || task.status === 'ESCALATED';
      return {
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        status: task.status,
        severity: task.status === 'ESCALATED' ? 'Escalated' : overdue ? 'Overdue' : 'Approaching',
        assignedBy: task.assignedBy?.name ?? 'Management'
      };
    });

    console.log(`IT delay alerts for user ${itId}: ${alerts.length} tasks found`);
    return alerts;
  } catch (error) {
    console.error(`Error fetching IT delay alerts for user ${itId}:`, error);
    throw error;
  }
};