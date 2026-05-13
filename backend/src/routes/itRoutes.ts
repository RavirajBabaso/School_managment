import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';
import * as itController from '../controllers/itController';

const router = Router();

router.use(authenticate, requireRole('IT'));

router.get('/dashboard', itController.getDashboard);
router.get('/tasks', itController.getTasks);
router.get('/tasks/:id', itController.getTaskById);
router.put('/tasks/:id', upload.single('attachment'), itController.updateTask);
router.get('/announcements', itController.getAnnouncements);
router.get('/analytics', itController.getAnalytics);
router.get('/delay-alerts', itController.getDelayAlerts);
router.get('/reports', itController.getReportHistory);
router.get('/reports/daily', itController.generateDailyReport);
router.get('/reports/weekly', itController.generateWeeklyReport);
router.get('/reports/monthly', itController.generateMonthlyReport);

export default router;