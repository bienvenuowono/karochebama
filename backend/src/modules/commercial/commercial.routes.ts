import { Router } from 'express';
import commercialController from './commercial.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

// Public route to submit commercial forms
router.post('/', commercialController.create);

// Protected routes (Admin only)
router.use(authenticate, authorize(['ADMIN']));
router.get('/', commercialController.getAll);
router.get('/:id', commercialController.getById);
router.put('/:id', commercialController.update);
router.delete('/:id', commercialController.delete);

export default router;
