import { Router } from 'express';
import activityController from './activity.controller';
import { authenticate } from '../../core/auth.middleware';

const router = Router();

router.get('/', activityController.getAll);
router.get('/:id', activityController.getById);

// Protected routes
router.use(authenticate);
router.post('/', activityController.create);
router.put('/:id', activityController.update);
router.delete('/:id', activityController.delete);

export default router;
