import { Router } from 'express';
import productController from './product.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Protected routes (Suppliers and Admins)
router.post('/', authenticate, authorize(['ADMIN', 'SUPPLIER']), productController.create);
router.put('/:id', authenticate, authorize(['ADMIN', 'SUPPLIER']), productController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), productController.delete);

export default router;
