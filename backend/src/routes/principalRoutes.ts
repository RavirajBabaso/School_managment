import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { param, query } from 'express-validator';
import * as principalController from '../controllers/principalController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';
import { TASK_STATUSES } from '../models';

const router = Router();

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(authenticate, requireRole('PRINCIPAL'));

router.get('/dashboard', asyncHandler(principalController.getDashboard));
router.get('/analytics', asyncHandler(principalController.getAnalytics));
router.get('/delay-alerts', asyncHandler(principalController.getDelayAlerts));
router.get('/announcements', asyncHandler(principalController.getAnnouncements));

router.get(
  '/tasks',
  query('status').optional().custom((value) => value === 'ALL' || TASK_STATUSES.includes(value)),
  handleValidationErrors,
  asyncHandler(principalController.getTasks)
);

router.get(
  '/tasks/:id',
  param('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
  handleValidationErrors,
  asyncHandler(principalController.getTaskById)
);

router.put(
  '/tasks/:id',
  upload.single('attachment'),
  param('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
  handleValidationErrors,
  asyncHandler(principalController.updateTask)
);

router.get('/reports', asyncHandler(principalController.getReportHistory));
router.get('/reports/daily', asyncHandler(principalController.generateDailyReport));
router.get('/reports/weekly', asyncHandler(principalController.generateWeeklyReport));
router.get('/reports/monthly', asyncHandler(principalController.generateMonthlyReport));

export default router;
