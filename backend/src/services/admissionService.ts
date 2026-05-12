import { Op } from 'sequelize';
import { Announcement, Department, Report, Task, User, TaskStatus } from '../models';
import * as taskService from './taskService';
import * as reportService from './reportService';

export const getDashboard = async (admissionId: number) => {
  const tasks = await taskService.getTasksWithFilters({ assigned_to: admissionId });
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

export const getAdmissionTasks = (admissionId: number, status?: string) =>
  taskService.getTasksWithFilters({
    assigned_to: admissionId,
    ...(status && status !== 'ALL' ? { status } : {})
  });

export const getAdmissionTaskById = async (admissionId: number, taskId: number) => {
  const task = await taskService.getTaskById(taskId);
  if (!task || task.assigned_to !== admissionId) {
    return null;
  }
  return task;
};

export const updateAdmissionTask = async (
  admissionId: number,
  taskId: number,
  status: TaskStatus,
  comment?: string | null,
  attachmentPath?: string | null
) => {
  const existingTask = await Task.findOne({ where: { id: taskId, assigned_to: admissionId } });
  if (!existingTask) {
    return null;
  }
  return taskService.updateTask(taskId, { status, comment, attachment_path: attachmentPath }, admissionId);
};

export const getAdmissionAnnouncements = async (admissionId: number) => {
  const admissionUser = await User.findByPk(admissionId);
  if (!admissionUser) {
    return [];
  }

  return Announcement.findAll({
    where: {
      [Op.or]: [
        { target: 'ALL' },
        { target: 'DEPARTMENT', department_id: admissionUser.department_id }
      ]
    },
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Department, as: 'department', attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']]
  });
};

export const generateDailyReport = (admissionId: number, date: string) =>
  reportService.generateDailyReport(date, undefined, admissionId, admissionId);

export const generateWeeklyReport = (admissionId: number, week: string) =>
  reportService.generateWeeklyReport(week, undefined, admissionId, admissionId);

export const generateMonthlyReport = (admissionId: number, year: number, month: number) =>
  reportService.generateMonthlyReport(year, month, undefined, admissionId, admissionId);

export const getReportHistory = async (admissionId: number) => {
  const reports = await Report.findAll({
    where: { generated_by: admissionId },
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
