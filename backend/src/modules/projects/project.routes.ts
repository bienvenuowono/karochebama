import { Router } from 'express';
import projectController from './project.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Protected routes
router.use(authenticate, authorize(['ADMIN']));
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;
