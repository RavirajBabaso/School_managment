import { Request, Response } from 'express';
import { TASK_STATUSES, TaskStatus } from '../models';
import * as purchaseService from '../services/purchaseService';
import * as purchaseAnalyticsService from '../services/purchaseAnalyticsService';
import { errorResponse, successResponse } from '../utils/responseHelper';

const requirePurchaseId = (req: Request) => req.user!.id;

const buildAttachmentPath = (file?: Express.Multer.File) => {
  if (!file) {
    return undefined;
  }

  return `uploads/${file.filename}`;
};

export const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await purchaseService.getDashboard(requirePurchaseId(req));
  return successResponse(res, dashboard, 'Purchase dashboard fetched successfully');
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await purchaseService.getPurchaseTasks(
    requirePurchaseId(req),
    typeof req.query.status === 'string' ? req.query.status : undefined
  );
  return successResponse(res, tasks, 'Purchase tasks fetched successfully');
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await purchaseService.getPurchaseTaskById(requirePurchaseId(req), Number(req.params.id));

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'Purchase task fetched successfully');
};

export const updateTask = async (req: Request, res: Response) => {
  const status = req.body.status as TaskStatus | undefined;

  if (!status || !TASK_STATUSES.includes(status)) {
    return errorResponse(res, 'Invalid task status', 400);
  }

  const task = await purchaseService.updatePurchaseTask(
    requirePurchaseId(req),
    Number(req.params.id),
    status,
    typeof req.body.comment === 'string' ? req.body.comment : null,
    buildAttachmentPath(req.file)
  );

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'Purchase task updated successfully');
};

export const getAnnouncements = async (req: Request, res: Response) => {
  const announcements = await purchaseService.getPurchaseAnnouncements(requirePurchaseId(req));
  return successResponse(res, announcements, 'Purchase announcements fetched successfully');
};

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await purchaseAnalyticsService.getPurchaseAnalytics(requirePurchaseId(req));
  return successResponse(res, analytics, 'Purchase analytics fetched successfully');
};

export const getDelayAlerts = async (req: Request, res: Response) => {
  const alerts = await purchaseAnalyticsService.getPurchaseDelayAlerts(requirePurchaseId(req));
  return successResponse(res, alerts, 'Purchase delay alerts fetched successfully');
};

export const getReportHistory = async (req: Request, res: Response) => {
  const reports = await purchaseService.getReportHistory(requirePurchaseId(req));
  return successResponse(res, reports, 'Purchase report history fetched successfully');
};

export const generateDailyReport = async (req: Request, res: Response) => {
  const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString();
  const report = await purchaseService.generateDailyReport(requirePurchaseId(req), date);
  return successResponse(res, report, 'Purchase daily report generated successfully');
};

export const generateWeeklyReport = async (req: Request, res: Response) => {
  const week = typeof req.query.week === 'string' ? req.query.week : new Date().toISOString();
  const report = await purchaseService.generateWeeklyReport(requirePurchaseId(req), week);
  return successResponse(res, report, 'Purchase weekly report generated successfully');
};

export const generateMonthlyReport = async (req: Request, res: Response) => {
  const now = new Date();
  const year = Number(req.query.year ?? now.getFullYear());
  const month = Number(req.query.month ?? now.getMonth() + 1);

  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return errorResponse(res, 'Invalid report month or year', 400);
  }

  const report = await purchaseService.generateMonthlyReport(requirePurchaseId(req), year, month);
  return successResponse(res, report, 'Purchase monthly report generated successfully');
};
