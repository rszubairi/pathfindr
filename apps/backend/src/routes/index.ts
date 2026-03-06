import { Router } from 'express';
import authRoutes from './auth.routes';
import uapRoutes from './uap.routes';
import scholarshipRoutes from './scholarship.routes';
import universityRoutes from './university.routes';
import jobRoutes from './job.routes';
import notificationRoutes from './notification.routes';
import subscriptionRoutes from './subscription.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/uap', uapRoutes);
router.use('/scholarships', scholarshipRoutes);
router.use('/universities', universityRoutes);
router.use('/jobs', jobRoutes);
router.use('/notifications', notificationRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;
