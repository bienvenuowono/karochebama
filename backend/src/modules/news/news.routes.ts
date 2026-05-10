import { Router } from 'express';
import newsController from './news.controller';
import { authenticate } from '../../core/auth.middleware';

const router = Router();

router.get('/', newsController.getAll);
router.get('/:id', newsController.getById);

// Protected routes
router.use(authenticate);
router.post('/', newsController.create);
router.put('/:id', newsController.update);
router.delete('/:id', newsController.delete);

export default router;
