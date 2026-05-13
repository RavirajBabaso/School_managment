import { Request, Response } from 'express';
import { TASK_STATUSES, TaskStatus } from '../models';
import * as itService from '../services/itService';
import * as itAnalyticsService from '../services/itAnalyticsService';
import { errorResponse, successResponse } from '../utils/responseHelper';

const requireITId = (req: Request) => req.user!.id;

const buildAttachmentPath = (file?: Express.Multer.File) => {
  if (!file) {
    return undefined;
  }
  return `uploads/${file.filename}`;
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    console.log(`IT Dashboard requested by user ${req.user!.id}`);
    const dashboard = await itService.getDashboard(requireITId(req));
    return successResponse(res, dashboard, 'IT dashboard fetched successfully');
  } catch (error) {
    console.error('Error in getDashboard controller:', error);
    return errorResponse(res, 'Failed to fetch IT dashboard', 500);
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    console.log(`IT Tasks requested by user ${req.user!.id}, status=${status || 'ALL'}`);
    const tasks = await itService.getITTasks(
      requireITId(req),
      status
    );
    return successResponse(res, tasks, 'IT tasks fetched successfully');
  } catch (error) {
    console.error('Error in getTasks controller:', error);
    return errorResponse(res, 'Failed to fetch IT tasks', 500);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    console.log(`IT Task ${req.params.id} requested by user ${req.user!.id}`);
    const task = await itService.getITTaskById(requireITId(req), Number(req.params.id));

    if (!task) {
      console.warn(`IT Task ${req.params.id} not found for user ${req.user!.id}`);
      return errorResponse(res, 'Task not found', 404);
    }

    return successResponse(res, task, 'IT task fetched successfully');
  } catch (error) {
    console.error('Error in getTaskById controller:', error);
    return errorResponse(res, 'Failed to fetch IT task', 500);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const status = req.body.status as TaskStatus | undefined;

    if (!status || !TASK_STATUSES.includes(status)) {
      console.warn(`Invalid task status requested by user ${req.user!.id}: ${status}`);
      return errorResponse(res, 'Invalid task status', 400);
    }

    console.log(`Updating IT Task ${req.params.id} to status=${status} by user ${req.user!.id}`);
    const task = await itService.updateITTask(
      requireITId(req),
      Number(req.params.id),
      status,
      typeof req.body.comment === 'string' ? req.body.comment : null,
      buildAttachmentPath(req.file)
    );

    if (!task) {
      console.warn(`IT Task ${req.params.id} not found for update by user ${req.user!.id}`);
      return errorResponse(res, 'Task not found', 404);
    }

    return successResponse(res, task, 'IT task updated successfully');
  } catch (error) {
    console.error('Error in updateTask controller:', error);
    return errorResponse(res, 'Failed to update IT task', 500);
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    console.log(`IT Announcements requested by user ${req.user!.id}`);
    const announcements = await itService.getITAnnouncements(requireITId(req));
    return successResponse(res, announcements, 'IT announcements fetched successfully');
  } catch (error) {
    console.error('Error in getAnnouncements controller:', error);
    return errorResponse(res, 'Failed to fetch IT announcements', 500);
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    console.log(`IT Analytics requested by user ${req.user!.id}`);
    const analytics = await itAnalyticsService.getITAnalytics(requireITId(req));
    return successResponse(res, analytics, 'IT analytics fetched successfully');
  } catch (error) {
    console.error('Error in getAnalytics controller:', error);
    return errorResponse(res, 'Failed to fetch IT analytics', 500);
  }
};

export const getDelayAlerts = async (req: Request, res: Response) => {
  try {
    console.log(`IT Delay Alerts requested by user ${req.user!.id}`);
    const alerts = await itAnalyticsService.getITDelayAlerts(requireITId(req));
    return successResponse(res, alerts, 'IT delay alerts fetched successfully');
  } catch (error) {
    console.error('Error in getDelayAlerts controller:', error);
    return errorResponse(res, 'Failed to fetch IT delay alerts', 500);
  }
};

export const getReportHistory = async (req: Request, res: Response) => {
  try {
    console.log(`IT Report History requested by user ${req.user!.id}`);
    const reports = await itService.getReportHistory(requireITId(req));
    return successResponse(res, reports, 'IT report history fetched successfully');
  } catch (error) {
    console.error('Error in getReportHistory controller:', error);
    return errorResponse(res, 'Failed to fetch IT report history', 500);
  }
};

export const generateDailyReport = async (req: Request, res: Response) => {
  try {
    const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString();
    console.log(`IT Daily Report generation requested by user ${req.user!.id} for date ${date}`);
    const report = await itService.generateDailyReport(requireITId(req), date);
    return successResponse(res, report, 'IT daily report generated successfully');
  } catch (error) {
    console.error('Error in generateDailyReport controller:', error);
    return errorResponse(res, 'Failed to generate daily report', 500);
  }
};

export const generateWeeklyReport = async (req: Request, res: Response) => {
  try {
    const week = typeof req.query.week === 'string' ? req.query.week : new Date().toISOString();
    console.log(`IT Weekly Report generation requested by user ${req.user!.id} for week ${week}`);
    const report = await itService.generateWeeklyReport(requireITId(req), week);
    return successResponse(res, report, 'IT weekly report generated successfully');
  } catch (error) {
    console.error('Error in generateWeeklyReport controller:', error);
    return errorResponse(res, 'Failed to generate weekly report', 500);
  }
};

export const generateMonthlyReport = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const year = Number(req.query.year ?? now.getFullYear());
    const month = Number(req.query.month ?? now.getMonth() + 1);

    if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
      console.warn(`Invalid report month/year requested by user ${req.user!.id}: year=${year}, month=${month}`);
      return errorResponse(res, 'Invalid report month or year', 400);
    }

    console.log(`IT Monthly Report generation requested by user ${req.user!.id} for ${year}-${month}`);
    const report = await itService.generateMonthlyReport(requireITId(req), year, month);
    return successResponse(res, report, 'IT monthly report generated successfully');
  } catch (error) {
    console.error('Error in generateMonthlyReport controller:', error);
    return errorResponse(res, 'Failed to generate monthly report', 500);
  }
};