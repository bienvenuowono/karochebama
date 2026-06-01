import { Router } from 'express';
import { BlogController } from './controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { createBlogSchema, updateBlogSchema, getBlogSchema } from './validation';

const router = Router();
const controller = new BlogController();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

router.get('/', controller.getAll);
router.get('/:id', validateRequest(getBlogSchema), controller.getById);
router.post('/', validateRequest(createBlogSchema), controller.create);
router.put('/:id', validateRequest(getBlogSchema), validateRequest(updateBlogSchema), controller.update);
router.delete('/:id', validateRequest(getBlogSchema), controller.delete);

export default router;
