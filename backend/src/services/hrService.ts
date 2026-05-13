import { Op } from 'sequelize';
import { Announcement, Department, Report, Task, User, TaskStatus } from '../models';
import * as taskService from './taskService';
import * as reportService from './reportService';

export const getDashboard = async (hrId: number) => {
  const tasks = await taskService.getTasksWithFilters({ assigned_to: hrId });
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

export const getHRTasks = (hrId: number, status?: string) =>
  taskService.getTasksWithFilters({
    assigned_to: hrId,
    ...(status && status !== 'ALL' ? { status } : {})
  });

export const getHRTaskById = async (hrId: number, taskId: number) => {
  const task = await taskService.getTaskById(taskId);
  if (!task || task.assigned_to !== hrId) {
    return null;
  }
  return task;
};

export const updateHRTask = async (
  hrId: number,
  taskId: number,
  status: TaskStatus,
  comment?: string | null,
  attachmentPath?: string | null
) => {
  const existingTask = await Task.findOne({ where: { id: taskId, assigned_to: hrId } });
  if (!existingTask) {
    return null;
  }
  return taskService.updateTask(taskId, { status, comment, attachment_path: attachmentPath }, hrId);
};

export const getHRAnnouncements = async (hrId: number) => {
  const hrUser = await User.findByPk(hrId);
  if (!hrUser) {
    return [];
  }

  return Announcement.findAll({
    where: {
      [Op.or]: [
        { target: 'ALL' },
        { target: 'DEPARTMENT', department_id: hrUser.department_id },
        { target: 'HR' }
      ]
    },
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Department, as: 'department', attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']]
  });
};

export const generateDailyReport = (hrId: number, date: string) =>
  reportService.generateDailyReport(date, undefined, hrId, hrId);

export const generateWeeklyReport = (hrId: number, week: string) =>
  reportService.generateWeeklyReport(week, undefined, hrId, hrId);

export const generateMonthlyReport = (hrId: number, year: number, month: number) =>
  reportService.generateMonthlyReport(year, month, undefined, hrId, hrId);

export const getReportHistory = async (hrId: number) => {
  const reports = await Report.findAll({
    where: { generated_by: hrId },
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