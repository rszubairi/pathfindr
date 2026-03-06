import { Router } from 'express';
import { UAPController } from '../controllers/uap.controller';
import { authenticate } from '../middleware/authenticate';
import { upload } from '../middleware/upload';

const router = Router();
const uapController = new UAPController();

router.use(authenticate); // All UAP routes require authentication

router.get('/profile', uapController.getProfile);
router.put('/profile', uapController.updateProfile);
router.post('/documents', upload.single('file'), uapController.uploadDocument);
router.delete('/documents/:id', uapController.deleteDocument);

export default router;
