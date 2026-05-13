import { Op } from 'sequelize';
import { Announcement, Department, Report, Task, User, TaskStatus } from '../models';
import * as taskService from './taskService';
import * as reportService from './reportService';

export const getDashboard = async (purchaseId: number) => {
  const tasks = await taskService.getTasksWithFilters({ assigned_to: purchaseId });
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === 'PENDING').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const delayedTasks = tasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length;

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    delayedTasks,
    completionRate: totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(2))
  };
};

export const getPurchaseTasks = (purchaseId: number, status?: string) =>
  taskService.getTasksWithFilters({
    assigned_to: purchaseId,
    ...(status && status !== 'ALL' ? { status } : {})
  });

export const getPurchaseTaskById = async (purchaseId: number, taskId: number) => {
  const task = await taskService.getTaskById(taskId);
  if (!task || task.assigned_to !== purchaseId) {
    return null;
  }
  return task;
};

export const updatePurchaseTask = async (
  purchaseId: number,
  taskId: number,
  status: TaskStatus,
  comment?: string | null,
  attachmentPath?: string | null
) => {
  const existingTask = await Task.findOne({ where: { id: taskId, assigned_to: purchaseId } });
  if (!existingTask) {
    return null;
  }
  return taskService.updateTask(taskId, { status, comment, attachment_path: attachmentPath }, purchaseId);
};

export const getPurchaseAnnouncements = async (purchaseId: number) => {
  const purchaseUser = await User.findByPk(purchaseId);
  if (!purchaseUser) {
    return [];
  }

  return Announcement.findAll({
    where: {
      [Op.or]: [
        { target: 'ALL' },
        { target: 'DEPARTMENT', department_id: purchaseUser.department_id },
        { target: 'PURCHASE' }
      ]
    },
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Department, as: 'department', attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']]
  });
};

export const generateDailyReport = (purchaseId: number, date: string) =>
  reportService.generateDailyReport(date, undefined, purchaseId, purchaseId);

export const generateWeeklyReport = (purchaseId: number, week: string) =>
  reportService.generateWeeklyReport(week, undefined, purchaseId, purchaseId);

export const generateMonthlyReport = (purchaseId: number, year: number, month: number) =>
  reportService.generateMonthlyReport(year, month, undefined, purchaseId, purchaseId);

export const getReportHistory = async (purchaseId: number) => {
  const reports = await Report.findAll({
    where: { generated_by: purchaseId },
    order: [['created_at', 'DESC']]
  });

  return reports.map((report) => ({
    id: report.id,
    type: report.type,
    dateFrom: report.date_from,
    dateTo: report.date_to,
    createdAt: report.created_at
  }));
};
