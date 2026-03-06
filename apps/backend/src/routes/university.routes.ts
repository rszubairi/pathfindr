import { Router } from 'express';
import { UniversityController } from '../controllers/university.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const universityController = new UniversityController();

router.get('/', universityController.getAll);
router.get('/:id', universityController.getById);
router.get('/:id/programmes', universityController.getProgrammes);
router.post('/:id/follow', authenticate, universityController.follow);
router.delete('/:id/follow', authenticate, universityController.unfollow);

export default router;
