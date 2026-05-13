import { Request, Response } from 'express';
import { TASK_STATUSES, TaskStatus } from '../models';
import * as hrService from '../services/hrService';
import * as hrAnalyticsService from '../services/hrAnalyticsService';
import { errorResponse, successResponse } from '../utils/responseHelper';

const requireHRId = (req: Request) => req.user!.id;

const buildAttachmentPath = (file?: Express.Multer.File) => {
  if (!file) {
    return undefined;
  }

  return `uploads/${file.filename}`;
};

export const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await hrService.getDashboard(requireHRId(req));
  return successResponse(res, dashboard, 'HR dashboard fetched successfully');
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await hrService.getHRTasks(
    requireHRId(req),
    typeof req.query.status === 'string' ? req.query.status : undefined
  );
  return successResponse(res, tasks, 'HR tasks fetched successfully');
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await hrService.getHRTaskById(requireHRId(req), Number(req.params.id));

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'HR task fetched successfully');
};

export const updateTask = async (req: Request, res: Response) => {
  const status = req.body.status as TaskStatus | undefined;

  if (!status || !TASK_STATUSES.includes(status)) {
    return errorResponse(res, 'Invalid task status', 400);
  }

  const task = await hrService.updateHRTask(
    requireHRId(req),
    Number(req.params.id),
    status,
    typeof req.body.comment === 'string' ? req.body.comment : null,
    buildAttachmentPath(req.file)
  );

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'HR task updated successfully');
};

export const getAnnouncements = async (req: Request, res: Response) => {
  const announcements = await hrService.getHRAnnouncements(requireHRId(req));
  return successResponse(res, announcements, 'HR announcements fetched successfully');
};

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await hrAnalyticsService.getHRAnalytics(requireHRId(req));
  return successResponse(res, analytics, 'HR analytics fetched successfully');
};

export const getDelayAlerts = async (req: Request, res: Response) => {
  const alerts = await hrAnalyticsService.getHRDelayAlerts(requireHRId(req));
  return successResponse(res, alerts, 'HR delay alerts fetched successfully');
};

export const getReportHistory = async (req: Request, res: Response) => {
  const reports = await hrService.getReportHistory(requireHRId(req));
  return successResponse(res, reports, 'HR report history fetched successfully');
};

export const generateDailyReport = async (req: Request, res: Response) => {
  const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString();
  const report = await hrService.generateDailyReport(requireHRId(req), date);
  return successResponse(res, report, 'HR daily report generated successfully');
};

export const generateWeeklyReport = async (req: Request, res: Response) => {
  const week = typeof req.query.week === 'string' ? req.query.week : new Date().toISOString();
  const report = await hrService.generateWeeklyReport(requireHRId(req), week);
  return successResponse(res, report, 'HR weekly report generated successfully');
};

export const generateMonthlyReport = async (req: Request, res: Response) => {
  const now = new Date();
  const year = Number(req.query.year ?? now.getFullYear());
  const month = Number(req.query.month ?? now.getMonth() + 1);

  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return errorResponse(res, 'Invalid report month or year', 400);
  }

  const report = await hrService.generateMonthlyReport(requireHRId(req), year, month);
  return successResponse(res, report, 'HR monthly report generated successfully');
};