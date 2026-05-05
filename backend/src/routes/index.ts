import { Router } from 'express';
import announcementRoutes from './announcementRoutes';
import approvalRoutes from './approvalRoutes';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import healthRoutes from './health.routes';
import notificationRoutes from './notificationRoutes';
import reportRoutes from './reportRoutes';
import taskRoutes from './taskRoutes';
import userRoutes from './userRoutes';
import meetings from './meetings';
import notifications from './notifications';
import approvals from './approvals';
import communications from './communications';
import directorModules from './directorModules';

const router = Router();

router.use('/announcements', announcementRoutes);
router.use('/approvals', approvalRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/health', healthRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/meetings', meetings);
router.use('/notifications', notifications);
router.use('/approvals', approvals);
router.use('/communications', communications);
router.use('/director-modules', directorModules);

export default router;
