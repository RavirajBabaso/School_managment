import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { param, query } from 'express-validator';
import * as admissionController from '../controllers/admissionController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';
import { TASK_STATUSES } from '../models';

const router = Router();

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

router.use(authenticate, requireRole('ADMISSION'));

router.get('/dashboard', asyncHandler(admissionController.getDashboard));
router.get('/analytics', asyncHandler(admissionController.getAnalytics));
router.get('/delay-alerts', asyncHandler(admissionController.getDelayAlerts));
router.get('/announcements', asyncHandler(admissionController.getAnnouncements));

router.get(
  '/tasks',
  query('status').optional().custom((value) => value === 'ALL' || TASK_STATUSES.includes(value)),
  handleValidationErrors,
  asyncHandler(admissionController.getTasks)
);

router.get(
  '/tasks/:id',
  param('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
  handleValidationErrors,
  asyncHandler(admissionController.getTaskById)
);

router.put(
  '/tasks/:id',
  upload.single('attachment'),
  param('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
  handleValidationErrors,
  asyncHandler(admissionController.updateTask)
);

router.get('/reports', asyncHandler(admissionController.getReportHistory));
router.get('/reports/daily', asyncHandler(admissionController.generateDailyReport));
router.get('/reports/weekly', asyncHandler(admissionController.generateWeeklyReport));
router.get('/reports/monthly', asyncHandler(admissionController.generateMonthlyReport));

export default router;
