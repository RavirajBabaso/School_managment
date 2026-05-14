import { Request, Response } from 'express';
import { TASK_STATUSES, TaskStatus } from '../models';
import * as transportService from '../services/transportService';
import * as transportAnalyticsService from '../services/transportAnalyticsService';
import { errorResponse, successResponse } from '../utils/responseHelper';

const requireTransportId = (req: Request) => req.user!.id;

const buildAttachmentPath = (file?: Express.Multer.File) => {
  if (!file) {
    return undefined;
  }
  return `uploads/${file.filename}`;
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    console.log(`Transport Dashboard requested by user ${req.user!.id}`);
    const dashboard = await transportService.getDashboard(requireTransportId(req));
    return successResponse(res, dashboard, 'Transport dashboard fetched successfully');
  } catch (error) {
    console.error('Error in getDashboard controller:', error);
    return errorResponse(res, 'Failed to fetch Transport dashboard', 500);
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    console.log(`Transport Tasks requested by user ${req.user!.id}, status=${status || 'ALL'}`);
    const tasks = await transportService.getTransportTasks(
      requireTransportId(req),
      status
    );
    return successResponse(res, tasks, 'Transport tasks fetched successfully');
  } catch (error) {
    console.error('Error in getTasks controller:', error);
    return errorResponse(res, 'Failed to fetch Transport tasks', 500);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    console.log(`Transport Task ${req.params.id} requested by user ${req.user!.id}`);
    const task = await transportService.getTransportTaskById(requireTransportId(req), Number(req.params.id));

    if (!task) {
      console.warn(`Transport Task ${req.params.id} not found for user ${req.user!.id}`);
      return errorResponse(res, 'Task not found', 404);
    }

    return successResponse(res, task, 'Transport task fetched successfully');
  } catch (error) {
    console.error('Error in getTaskById controller:', error);
    return errorResponse(res, 'Failed to fetch Transport task', 500);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const status = req.body.status as TaskStatus | undefined;

    if (!status || !TASK_STATUSES.includes(status)) {
      console.warn(`Invalid task status requested by user ${req.user!.id}: ${status}`);
      return errorResponse(res, 'Invalid task status', 400);
    }

    console.log(`Updating Transport Task ${req.params.id} to status=${status} by user ${req.user!.id}`);
    const task = await transportService.updateTransportTask(
      requireTransportId(req),
      Number(req.params.id),
      status,
      typeof req.body.comment === 'string' ? req.body.comment : null,
      buildAttachmentPath(req.file)
    );

    if (!task) {
      console.warn(`Transport Task ${req.params.id} not found for update by user ${req.user!.id}`);
      return errorResponse(res, 'Task not found', 404);
    }

    return successResponse(res, task, 'Transport task updated successfully');
  } catch (error) {
    console.error('Error in updateTask controller:', error);
    return errorResponse(res, 'Failed to update Transport task', 500);
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    console.log(`Transport Announcements requested by user ${req.user!.id}`);
    const announcements = await transportService.getTransportAnnouncements(requireTransportId(req));
    return successResponse(res, announcements, 'Transport announcements fetched successfully');
  } catch (error) {
    console.error('Error in getAnnouncements controller:', error);
    return errorResponse(res, 'Failed to fetch Transport announcements', 500);
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    console.log(`Transport Analytics requested by user ${req.user!.id}`);
    const analytics = await transportAnalyticsService.getTransportAnalytics(requireTransportId(req));
    return successResponse(res, analytics, 'Transport analytics fetched successfully');
  } catch (error) {
    console.error('Error in getAnalytics controller:', error);
    return errorResponse(res, 'Failed to fetch Transport analytics', 500);
  }
};

export const getDelayAlerts = async (req: Request, res: Response) => {
  try {
    console.log(`Transport Delay Alerts requested by user ${req.user!.id}`);
    const alerts = await transportAnalyticsService.getTransportDelayAlerts(requireTransportId(req));
    return successResponse(res, alerts, 'Transport delay alerts fetched successfully');
  } catch (error) {
    console.error('Error in getDelayAlerts controller:', error);
    return errorResponse(res, 'Failed to fetch Transport delay alerts', 500);
  }
};

export const getReportHistory = async (req: Request, res: Response) => {
  try {
    console.log(`Transport Report History requested by user ${req.user!.id}`);
    const reports = await transportService.getReportHistory(requireTransportId(req));
    return successResponse(res, reports, 'Transport report history fetched successfully');
  } catch (error) {
    console.error('Error in getReportHistory controller:', error);
    return errorResponse(res, 'Failed to fetch Transport report history', 500);
  }
};

export const generateDailyReport = async (req: Request, res: Response) => {
  try {
    const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString().split('T')[0];
    console.log(`Transport Daily Report generation requested by user ${req.user!.id} for date ${date}`);
    const report = await transportService.generateDailyReport(requireTransportId(req), date);
    return successResponse(res, report, 'Transport daily report generated successfully');
  } catch (error) {
    console.error('Error in generateDailyReport controller:', error);
    return errorResponse(res, 'Failed to generate daily report', 500);
  }
};

export const generateWeeklyReport = async (req: Request, res: Response) => {
  try {
    const week = typeof req.query.week === 'string' ? req.query.week : new Date().toISOString();
    console.log(`Transport Weekly Report generation requested by user ${req.user!.id} for week ${week}`);
    const report = await transportService.generateWeeklyReport(requireTransportId(req), week);
    return successResponse(res, report, 'Transport weekly report generated successfully');
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

    console.log(`Transport Monthly Report generation requested by user ${req.user!.id} for ${year}-${month}`);
    const report = await transportService.generateMonthlyReport(requireTransportId(req), year, month);
    return successResponse(res, report, 'Transport monthly report generated successfully');
  } catch (error) {
    console.error('Error in generateMonthlyReport controller:', error);
    return errorResponse(res, 'Failed to generate monthly report', 500);
  }
};