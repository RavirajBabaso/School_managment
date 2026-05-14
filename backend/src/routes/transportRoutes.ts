import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';
import * as transportController from '../controllers/transportController';

const router = Router();

router.use(authenticate, requireRole('TRANSPORT'));

router.get('/dashboard', transportController.getDashboard);
router.get('/tasks', transportController.getTasks);
router.get('/tasks/:id', transportController.getTaskById);
router.put('/tasks/:id', upload.single('attachment'), transportController.updateTask);
router.get('/announcements', transportController.getAnnouncements);
router.get('/analytics', transportController.getAnalytics);
router.get('/delay-alerts', transportController.getDelayAlerts);
router.get('/reports', transportController.getReportHistory);
router.get('/reports/daily', transportController.generateDailyReport);
router.get('/reports/weekly', transportController.generateWeeklyReport);
router.get('/reports/monthly', transportController.generateMonthlyReport);

export default router;