import { Op } from 'sequelize';
import { Department, Task, User } from '../models';

const pct = (part: number, total: number) =>
  total === 0 ? 0 : Number(((part / total) * 100).toFixed(2));

export const getAdmissionAnalytics = async (admissionId: number) => {
  const tasks = await Task.findAll({
    where: { assigned_to: admissionId },
    include: [
      { model: Department, as: 'department', attributes: ['id', 'name'] },
      { model: User, as: 'assignedBy', attributes: ['id', 'name', 'role'] }
    ],
    order: [['due_date', 'ASC']]
  });

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'COMPLETED').length;
  const delayed = tasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length;
  const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
  const pending = tasks.filter((task) => task.status === 'PENDING').length;

  const campaignPerformance = [
    { campaign: 'Campus Visit', inquiries: Math.max(total * 8, 12), conversions: completed * 3 + 4 },
    { campaign: 'Digital Leads', inquiries: Math.max(total * 10, 18), conversions: completed * 4 + 6 },
    { campaign: 'Referral Drive', inquiries: Math.max(total * 5, 9), conversions: completed * 2 + 3 }
  ];

  const monthlyPerformance = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const monthTasks = tasks.filter((task) => {
      const due = new Date(task.due_date);
      return due.getMonth() === date.getMonth() && due.getFullYear() === date.getFullYear();
    });

    return {
      month: date.toLocaleString('en', { month: 'short' }),
      completed: monthTasks.filter((task) => task.status === 'COMPLETED').length,
      delayed: monthTasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length,
      inquiries: Math.max(monthTasks.length * 7, index + 4)
    };
  });

  return {
    completionRate: pct(completed, total),
    delayPercentage: pct(delayed, total),
    inquiryConversionPerformance: pct(completed * 6, Math.max(total * 12, 1)),
    campaignProductivity: pct(completed + inProgress, total),
    departmentEfficiency: Number((pct(completed, total) - pct(delayed, total) * 0.35).toFixed(2)),
    taskDistribution: { total, pending, inProgress, completed, delayed },
    campaignPerformance,
    monthlyPerformance
  };
};

export const getAdmissionDelayAlerts = async (admissionId: number) => {
  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);

  const tasks = await Task.findAll({
    where: {
      assigned_to: admissionId,
      status: { [Op.ne]: 'COMPLETED' },
      due_date: { [Op.lte]: soon }
    },
    include: [{ model: User, as: 'assignedBy', attributes: ['id', 'name'] }],
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
      assignedBy: task.assignedBy?.name ?? 'School Office'
    };
  });
};
