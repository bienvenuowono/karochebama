import { Router } from 'express';
import { MediaController } from './controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { upload } from '../../core/middlewares/upload.middleware';

const router = Router();
const controller = new MediaController();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

router.get('/', controller.getAll);
router.post('/upload', upload.single('file'), controller.upload);
router.delete('/:id', controller.delete);

export default router;
