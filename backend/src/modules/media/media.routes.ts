import { Router } from 'express';
import mediaController from './media.controller';
import { authenticate } from '../../core/auth.middleware';

const router = Router();

router.get('/', mediaController.getAll);
router.get('/:id', mediaController.getById);

// Protected routes
router.use(authenticate);
router.post('/', mediaController.create);
router.put('/:id', mediaController.update);
router.delete('/:id', mediaController.delete);

export default router;
