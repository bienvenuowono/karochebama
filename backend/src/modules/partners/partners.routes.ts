import { Router } from 'express';
import partnerController from './partners.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

// Public route to submit partner applications
router.post('/', partnerController.create);

// Protected routes (Admin only)
router.use(authenticate, authorize(['ADMIN']));
router.get('/', partnerController.getAll);
router.get('/:id', partnerController.getById);
router.put('/:id', partnerController.update);
router.delete('/:id', partnerController.delete);

export default router;
