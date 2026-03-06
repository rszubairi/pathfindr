import { Router } from 'express';
import { ScholarshipController } from '../controllers/scholarship.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const scholarshipController = new ScholarshipController();

router.get('/', scholarshipController.getAll);
router.get('/:id', scholarshipController.getById);
router.post('/search', scholarshipController.search);
router.post('/:id/apply', authenticate, scholarshipController.apply);
router.get('/:id/match', authenticate, scholarshipController.getMatchScore);

export default router;
