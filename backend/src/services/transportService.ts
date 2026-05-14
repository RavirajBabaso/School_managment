import { Op } from 'sequelize';
import { Announcement, Department, Report, Task, User } from '../models';
import * as taskService from './taskService';
import * as reportService from './reportService';

export const getDashboard = async (transportId: number) => {
  try {
    const tasks = await taskService.getTasksWithFilters({ assigned_to: transportId });
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task) => task.status === 'PENDING').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
    const delayedTasks = tasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length;

    console.log(`Transport Dashboard: total=${totalTasks}, pending=${pendingTasks}, inProgress=${inProgressTasks}, completed=${completedTasks}, delayed=${delayedTasks}`);

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      delayedTasks,
      completionRate: totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching Transport dashboard:', error);
    throw error;
  }
};

export const getTransportTasks = (transportId: number, status?: string) => {
  console.log(`Fetching Transport tasks for transportId=${transportId}, status=${status || 'ALL'}`);
  return taskService.getTasksWithFilters({
    assigned_to: transportId,
    ...(status && status !== 'ALL' ? { status } : {})
  });
};

export const getTransportTaskById = async (transportId: number, taskId: number) => {
  try {
    const task = await taskService.getTaskById(taskId);
    if (!task || task.assigned_to !== transportId) {
      console.warn(`Task ${taskId} not found or not assigned to Transport user ${transportId}`);
      return null;
    }
    console.log(`Fetched Transport task ${taskId} for transportId=${transportId}`);
    return task;
  } catch (error) {
    console.error(`Error fetching Transport task ${taskId}:`, error);
    throw error;
  }
};

export const updateTransportTask = async (
  transportId: number,
  taskId: number,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'ESCALATED',
  comment?: string | null,
  attachmentPath?: string | null
) => {
  try {
    const existingTask = await Task.findOne({ where: { id: taskId, assigned_to: transportId } });
    if (!existingTask) {
      console.warn(`Task ${taskId} not found for Transport user ${transportId} during update`);
      return null;
    }
    const result = await taskService.updateTask(taskId, { status, comment, attachment_path: attachmentPath }, transportId);
    console.log(`Updated Transport task ${taskId}: status=${status}, comment=${comment || 'none'}`);
    return result;
  } catch (error) {
    console.error(`Error updating Transport task ${taskId}:`, error);
    throw error;
  }
};

export const getTransportAnnouncements = async (transportId: number) => {
  try {
    const transportUser = await User.findByPk(transportId);
    if (!transportUser) {
      console.warn(`Transport user ${transportId} not found when fetching announcements`);
      return [];
    }

    const announcements = await Announcement.findAll({
      where: {
        [Op.or]: [
          { target: 'ALL' },
          { target: 'DEPARTMENT', department_id: transportUser.department_id },
          { target: 'TRANSPORT' },
          { target: 'URGENT' }
        ]
      },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    console.log(`Fetched ${announcements.length} announcements for Transport user ${transportId}`);
    return announcements;
  } catch (error) {
    console.error(`Error fetching Transport announcements for user ${transportId}:`, error);
    throw error;
  }
};

export const generateDailyReport = (transportId: number, date: string) => {
  console.log(`Generating daily report for Transport user ${transportId} on ${date}`);
  return reportService.generateDailyReport(date, undefined, transportId, transportId);
};

export const generateWeeklyReport = (transportId: number, week: string) => {
  console.log(`Generating weekly report for Transport user ${transportId} for week ${week}`);
  return reportService.generateWeeklyReport(week, undefined, transportId, transportId);
};

export const generateMonthlyReport = (transportId: number, year: number, month: number) => {
  console.log(`Generating monthly report for Transport user ${transportId} for ${year}-${month}`);
  return reportService.generateMonthlyReport(year, month, undefined, transportId, transportId);
};

export const getReportHistory = async (transportId: number) => {
  try {
    const reports = await Report.findAll({
      where: { generated_by: transportId },
      order: [['created_at', 'DESC']]
    });
    console.log(`Fetched ${reports.length} report history entries for Transport user ${transportId}`);
    return reports.map((report) => ({
      id: report.id,
      type: report.type,
      dateFrom: report.date_from,
      dateTo: report.date_to,
      createdAt: report.created_at
    }));
  } catch (error) {
    console.error(`Error fetching report history for Transport user ${transportId}:`, error);
    throw error;
  }
};