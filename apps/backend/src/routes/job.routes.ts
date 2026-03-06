import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const jobController = new JobController();

router.get('/', jobController.getAll);
router.get('/:id', jobController.getById);
router.post('/:id/apply', authenticate, jobController.apply);

export default router;
