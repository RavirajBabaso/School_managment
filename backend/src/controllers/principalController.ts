import { Request, Response } from 'express';
import { TASK_STATUSES, TaskStatus } from '../models';
import * as principalService from '../services/principalService';
import * as principalAnalyticsService from '../services/principalAnalyticsService';
import { errorResponse, successResponse } from '../utils/responseHelper';

const requirePrincipalId = (req: Request) => req.user!.id;

const buildAttachmentPath = (file?: Express.Multer.File) => {
  if (!file) {
    return undefined;
  }

  return `uploads/${file.filename}`;
};

export const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await principalService.getDashboard(requirePrincipalId(req));
  return successResponse(res, dashboard, 'Principal dashboard fetched successfully');
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await principalService.getPrincipalTasks(
    requirePrincipalId(req),
    typeof req.query.status === 'string' ? req.query.status : undefined
  );
  return successResponse(res, tasks, 'Principal tasks fetched successfully');
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await principalService.getPrincipalTaskById(requirePrincipalId(req), Number(req.params.id));

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'Principal task fetched successfully');
};

export const updateTask = async (req: Request, res: Response) => {
  const status = req.body.status as TaskStatus | undefined;

  if (!status || !TASK_STATUSES.includes(status)) {
    return errorResponse(res, 'Invalid task status', 400);
  }

  const task = await principalService.updatePrincipalTask(
    requirePrincipalId(req),
    Number(req.params.id),
    status,
    typeof req.body.comment === 'string' ? req.body.comment : null,
    buildAttachmentPath(req.file)
  );

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'Principal task updated successfully');
};

export const getAnnouncements = async (req: Request, res: Response) => {
  const announcements = await principalService.getPrincipalAnnouncements(requirePrincipalId(req));
  return successResponse(res, announcements, 'Principal announcements fetched successfully');
};

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await principalAnalyticsService.getPrincipalAnalytics(requirePrincipalId(req));
  return successResponse(res, analytics, 'Principal analytics fetched successfully');
};

export const getDelayAlerts = async (req: Request, res: Response) => {
  const alerts = await principalAnalyticsService.getPrincipalDelayAlerts(requirePrincipalId(req));
  return successResponse(res, alerts, 'Principal delay alerts fetched successfully');
};

export const getReportHistory = async (req: Request, res: Response) => {
  const reports = await principalService.getReportHistory(requirePrincipalId(req));
  return successResponse(res, reports, 'Principal report history fetched successfully');
};

export const generateDailyReport = async (req: Request, res: Response) => {
  const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString();
  const report = await principalService.generateDailyReport(requirePrincipalId(req), date);
  return successResponse(res, report, 'Principal daily report generated successfully');
};

export const generateWeeklyReport = async (req: Request, res: Response) => {
  const week = typeof req.query.week === 'string' ? req.query.week : new Date().toISOString();
  const report = await principalService.generateWeeklyReport(requirePrincipalId(req), week);
  return successResponse(res, report, 'Principal weekly report generated successfully');
};

export const generateMonthlyReport = async (req: Request, res: Response) => {
  const now = new Date();
  const year = Number(req.query.year ?? now.getFullYear());
  const month = Number(req.query.month ?? now.getMonth() + 1);

  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return errorResponse(res, 'Invalid report month or year', 400);
  }

  const report = await principalService.generateMonthlyReport(requirePrincipalId(req), year, month);
  return successResponse(res, report, 'Principal monthly report generated successfully');
};
