import { Op } from 'sequelize';
import { Department, Task, User } from '../models';

const safePercentage = (part: number, total: number) =>
  total === 0 ? 0 : Number(((part / total) * 100).toFixed(2));

export const getPurchaseAnalytics = async (purchaseId: number) => {
  const tasks = await Task.findAll({
    where: { assigned_to: purchaseId },
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

  const vendorPerformance = tasks.reduce<Record<string, { completed: number; delayed: number; total: number }>>(
    (acc, task) => {
      const vendor = task.assignedBy?.name ?? 'Management';
      const current = acc[vendor] ?? { completed: 0, delayed: 0, total: 0 };
      current.total += 1;
      current.completed += task.status === 'COMPLETED' ? 1 : 0;
      current.delayed += task.status === 'DELAYED' || task.status === 'ESCALATED' ? 1 : 0;
      acc[vendor] = current;
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

  const priorityStats = {
    HIGH: tasks.filter((t) => t.priority === 'HIGH'),
    MEDIUM: tasks.filter((t) => t.priority === 'MEDIUM'),
    LOW: tasks.filter((t) => t.priority === 'LOW')
  };

  return {
    completionRate: safePercentage(completed, total),
    delayPercentage: safePercentage(delayed, total),
    procurementEfficiency: Number((safePercentage(completed, total) - safePercentage(delayed, total) * 0.3).toFixed(2)),
    taskDistribution: { total, pending, inProgress, completed, delayed },
    vendorPerformance: Object.entries(vendorPerformance).map(([vendor, value]) => ({
      vendor,
      score: Math.max(0, Number((safePercentage(value.completed, value.total) - value.delayed * 10).toFixed(2))),
      ...value
    })),
    monthlyPerformance,
    priorityDistribution: {
      high: priorityStats.HIGH.length,
      medium: priorityStats.MEDIUM.length,
      low: priorityStats.LOW.length
    }
  };
};

export const getPurchaseDelayAlerts = async (purchaseId: number) => {
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);

  const tasks = await Task.findAll({
    where: {
      assigned_to: purchaseId,
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

  return tasks.map((task) => {
    const due = new Date(task.due_date);
    const overdue = due < now || task.status === 'DELAYED' || task.status === 'ESCALATED';
    return {
      id: task.id,
      title: task.title,
      dueDate: task.due_date,
      status: task.status,
      severity: task.status === 'ESCALATED' ? 'Escalated' : overdue ? 'Overdue' : 'Approaching',
      assignedBy: task.assignedBy?.name ?? 'Management',
      priority: task.priority
    };
  });
};
