import { Op } from 'sequelize';
import { Announcement, Department, Report, Task, User } from '../models';
import * as taskService from './taskService';
import * as reportService from './reportService';
import { TaskStatus } from '../models';

export const getDashboard = async (principalId: number) => {
  const tasks = await taskService.getTasksWithFilters({ assigned_to: principalId });
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

export const getPrincipalTasks = async (principalId: number, status?: string) => {
  return taskService.getTasksWithFilters({
    assigned_to: principalId,
    ...(status && status !== 'ALL' ? { status } : {})
  });
};

export const getPrincipalTaskById = async (principalId: number, taskId: number) => {
  const task = await taskService.getTaskById(taskId);
  if (!task || task.assigned_to !== principalId) {
    return null;
  }
  return task;
};

export const updatePrincipalTask = async (
  principalId: number,
  taskId: number,
  status: TaskStatus,
  comment?: string | null,
  attachmentPath?: string | null
) => {
  const existingTask = await Task.findOne({
    where: { id: taskId, assigned_to: principalId }
  });

  if (!existingTask) {
    return null;
  }

  return taskService.updateTask(taskId, { status, comment, attachment_path: attachmentPath }, principalId);
};

export const getPrincipalAnnouncements = async (principalId: number) => {
  const principal = await User.findByPk(principalId);
  if (!principal) {
    return [];
  }

  return Announcement.findAll({
    where: {
      [Op.or]: [
        { target: 'ALL' },
        { target: 'DEPARTMENT', department_id: principal.department_id }
      ]
    },
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Department, as: 'department', attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']]
  });
};

export const generateDailyReport = (principalId: number, date: string) =>
  reportService.generateDailyReport(date, undefined, principalId, principalId);

export const generateWeeklyReport = (principalId: number, week: string) =>
  reportService.generateWeeklyReport(week, undefined, principalId, principalId);

export const generateMonthlyReport = (principalId: number, year: number, month: number) =>
  reportService.generateMonthlyReport(year, month, undefined, principalId, principalId);

export const getReportHistory = async (principalId: number) => {
  const reports = await Report.findAll({
    where: { generated_by: principalId },
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
