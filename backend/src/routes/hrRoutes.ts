import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';
import * as hrController from '../controllers/hrController';

const router = Router();

router.use(authenticate, requireRole('HR'));

router.get('/dashboard', hrController.getDashboard);
router.get('/tasks', hrController.getTasks);
router.get('/tasks/:id', hrController.getTaskById);
router.put('/tasks/:id', upload.single('attachment'), hrController.updateTask);
router.get('/announcements', hrController.getAnnouncements);
router.get('/analytics', hrController.getAnalytics);
router.get('/delay-alerts', hrController.getDelayAlerts);
router.get('/reports', hrController.getReportHistory);
router.get('/reports/daily', hrController.generateDailyReport);
router.get('/reports/weekly', hrController.generateWeeklyReport);
router.get('/reports/monthly', hrController.generateMonthlyReport);

export default router;