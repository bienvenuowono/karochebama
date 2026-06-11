import { Router } from 'express';
import userController from './user.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Restricted to ADMIN
router.get('/', authorize(['ADMIN']), userController.getAll);
router.post('/', authorize(['ADMIN']), userController.create);
router.put('/:id', authorize(['ADMIN']), userController.update);
router.delete('/:id', authorize(['ADMIN']), userController.delete);
router.post('/:id/delete', authorize(['ADMIN']), userController.delete);

export default router;
