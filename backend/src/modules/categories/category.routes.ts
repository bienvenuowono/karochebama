import { Router } from 'express';
import categoryController from './category.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);
router.post('/', authenticate, authorize(['ADMIN']), categoryController.create);

export default router;
