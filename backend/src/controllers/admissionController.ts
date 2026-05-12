import { Request, Response } from 'express';
import { TASK_STATUSES, TaskStatus } from '../models';
import * as admissionService from '../services/admissionService';
import * as admissionAnalyticsService from '../services/admissionAnalyticsService';
import { errorResponse, successResponse } from '../utils/responseHelper';

const requireAdmissionId = (req: Request) => req.user!.id;

const buildAttachmentPath = (file?: Express.Multer.File) => {
  if (!file) {
    return undefined;
  }
  return `uploads/${file.filename}`;
};

export const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await admissionService.getDashboard(requireAdmissionId(req));
  return successResponse(res, dashboard, 'Admission dashboard fetched successfully');
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await admissionService.getAdmissionTasks(
    requireAdmissionId(req),
    typeof req.query.status === 'string' ? req.query.status : undefined
  );
  return successResponse(res, tasks, 'Admission tasks fetched successfully');
};

export const getTaskById = async (req: Request, res: Response) => {
  const task = await admissionService.getAdmissionTaskById(requireAdmissionId(req), Number(req.params.id));
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }
  return successResponse(res, task, 'Admission task fetched successfully');
};

export const updateTask = async (req: Request, res: Response) => {
  const status = req.body.status as TaskStatus | undefined;
  if (!status || !TASK_STATUSES.includes(status)) {
    return errorResponse(res, 'Invalid task status', 400);
  }

  const task = await admissionService.updateAdmissionTask(
    requireAdmissionId(req),
    Number(req.params.id),
    status,
    typeof req.body.comment === 'string' ? req.body.comment : null,
    buildAttachmentPath(req.file)
  );

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }
  return successResponse(res, task, 'Admission task updated successfully');
};

export const getAnnouncements = async (req: Request, res: Response) => {
  const announcements = await admissionService.getAdmissionAnnouncements(requireAdmissionId(req));
  return successResponse(res, announcements, 'Admission announcements fetched successfully');
};

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await admissionAnalyticsService.getAdmissionAnalytics(requireAdmissionId(req));
  return successResponse(res, analytics, 'Admission analytics fetched successfully');
};

export const getDelayAlerts = async (req: Request, res: Response) => {
  const alerts = await admissionAnalyticsService.getAdmissionDelayAlerts(requireAdmissionId(req));
  return successResponse(res, alerts, 'Admission delay alerts fetched successfully');
};

export const getReportHistory = async (req: Request, res: Response) => {
  const reports = await admissionService.getReportHistory(requireAdmissionId(req));
  return successResponse(res, reports, 'Admission report history fetched successfully');
};

export const generateDailyReport = async (req: Request, res: Response) => {
  const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString();
  const report = await admissionService.generateDailyReport(requireAdmissionId(req), date);
  return successResponse(res, report, 'Admission daily report generated successfully');
};

export const generateWeeklyReport = async (req: Request, res: Response) => {
  const week = typeof req.query.week === 'string' ? req.query.week : new Date().toISOString();
  const report = await admissionService.generateWeeklyReport(requireAdmissionId(req), week);
  return successResponse(res, report, 'Admission weekly report generated successfully');
};

export const generateMonthlyReport = async (req: Request, res: Response) => {
  const now = new Date();
  const year = Number(req.query.year ?? now.getFullYear());
  const month = Number(req.query.month ?? now.getMonth() + 1);
  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return errorResponse(res, 'Invalid report month or year', 400);
  }
  const report = await admissionService.generateMonthlyReport(requireAdmissionId(req), year, month);
  return successResponse(res, report, 'Admission monthly report generated successfully');
};
