import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const subscriptionController = new SubscriptionController();

router.use(authenticate); // All subscription routes require authentication

router.get('/', subscriptionController.getSubscription);
router.post('/upgrade', subscriptionController.upgrade);
router.post('/cancel', subscriptionController.cancel);
router.post('/webhook', subscriptionController.handleWebhook);

export default router;
