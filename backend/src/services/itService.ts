import { Op } from 'sequelize';
import { Announcement, Department, Report, Task, User } from '../models';
import * as taskService from './taskService';
import * as reportService from './reportService';

export const getDashboard = async (itId: number) => {
  try {
    const tasks = await taskService.getTasksWithFilters({ assigned_to: itId });
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task) => task.status === 'PENDING').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
    const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
    const delayedTasks = tasks.filter((task) => task.status === 'DELAYED' || task.status === 'ESCALATED').length;

    console.log(`IT Dashboard: total=${totalTasks}, pending=${pendingTasks}, inProgress=${inProgressTasks}, completed=${completedTasks}, delayed=${delayedTasks}`);

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      delayedTasks,
      completionRate: totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching IT dashboard:', error);
    throw error;
  }
};

export const getITTasks = (itId: number, status?: string) => {
  console.log(`Fetching IT tasks for itId=${itId}, status=${status || 'ALL'}`);
  return taskService.getTasksWithFilters({
    assigned_to: itId,
    ...(status && status !== 'ALL' ? { status } : {})
  });
};

export const getITTaskById = async (itId: number, taskId: number) => {
  try {
    const task = await taskService.getTaskById(taskId);
    if (!task || task.assigned_to !== itId) {
      console.warn(`Task ${taskId} not found or not assigned to IT user ${itId}`);
      return null;
    }
    console.log(`Fetched IT task ${taskId} for itId=${itId}`);
    return task;
  } catch (error) {
    console.error(`Error fetching IT task ${taskId}:`, error);
    throw error;
  }
};

export const updateITTask = async (
  itId: number,
  taskId: number,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'ESCALATED',
  comment?: string | null,
  attachmentPath?: string | null
) => {
  try {
    const existingTask = await Task.findOne({ where: { id: taskId, assigned_to: itId } });
    if (!existingTask) {
      console.warn(`Task ${taskId} not found for IT user ${itId} during update`);
      return null;
    }
    const result = await taskService.updateTask(taskId, { status, comment, attachment_path: attachmentPath }, itId);
    console.log(`Updated IT task ${taskId}: status=${status}, comment=${comment || 'none'}`);
    return result;
  } catch (error) {
    console.error(`Error updating IT task ${taskId}:`, error);
    throw error;
  }
};

export const getITAnnouncements = async (itId: number) => {
  try {
    const itUser = await User.findByPk(itId);
    if (!itUser) {
      console.warn(`IT user ${itId} not found when fetching announcements`);
      return [];
    }

    const announcements = await Announcement.findAll({
      where: {
        [Op.or]: [
          { target: 'ALL' },
          { target: 'DEPARTMENT', department_id: itUser.department_id },
          { target: 'IT' },
          { target: 'URGENT' }
        ]
      },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name'] },
        { model: Department, as: 'department', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    console.log(`Fetched ${announcements.length} announcements for IT user ${itId}`);
    return announcements;
  } catch (error) {
    console.error(`Error fetching IT announcements for user ${itId}:`, error);
    throw error;
  }
};

export const generateDailyReport = (itId: number, date: string) => {
  console.log(`Generating daily report for IT user ${itId} on ${date}`);
  return reportService.generateDailyReport(date, undefined, itId, itId);
};

export const generateWeeklyReport = (itId: number, week: string) => {
  console.log(`Generating weekly report for IT user ${itId} for week ${week}`);
  return reportService.generateWeeklyReport(week, undefined, itId, itId);
};

export const generateMonthlyReport = (itId: number, year: number, month: number) => {
  console.log(`Generating monthly report for IT user ${itId} for ${year}-${month}`);
  return reportService.generateMonthlyReport(year, month, undefined, itId, itId);
};

export const getReportHistory = async (itId: number) => {
  try {
    const reports = await Report.findAll({
      where: { generated_by: itId },
      order: [['created_at', 'DESC']]
    });
    console.log(`Fetched ${reports.length} report history entries for IT user ${itId}`);
    return reports.map((report) => ({
      id: report.id,
      type: report.type,
      dateFrom: report.date_from,
      dateTo: report.date_to,
      createdAt: report.created_at
    }));
  } catch (error) {
    console.error(`Error fetching report history for IT user ${itId}:`, error);
    throw error;
  }
};