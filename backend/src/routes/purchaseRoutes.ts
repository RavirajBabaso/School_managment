import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';
import * as purchaseController from '../controllers/purchaseController';

const router = Router();

router.use(authenticate, requireRole('PURCHASE'));

router.get('/dashboard', purchaseController.getDashboard);
router.get('/tasks', purchaseController.getTasks);
router.get('/tasks/:id', purchaseController.getTaskById);
router.put('/tasks/:id', upload.single('attachment'), purchaseController.updateTask);
router.get('/announcements', purchaseController.getAnnouncements);
router.get('/analytics', purchaseController.getAnalytics);
router.get('/delay-alerts', purchaseController.getDelayAlerts);
router.get('/reports', purchaseController.getReportHistory);
router.get('/reports/daily', purchaseController.generateDailyReport);
router.get('/reports/weekly', purchaseController.generateWeeklyReport);
router.get('/reports/monthly', purchaseController.generateMonthlyReport);

export default router;
