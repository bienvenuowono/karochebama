import { Router } from 'express';
import contactController from './contact.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

// Public route to submit contact forms
router.post('/', contactController.create);

// Protected routes (Admin only)
router.use(authenticate, authorize(['ADMIN']));
router.get('/', contactController.getAll);
router.get('/:id', contactController.getById);
router.put('/:id', contactController.update);
router.delete('/:id', contactController.delete);

export default router;
