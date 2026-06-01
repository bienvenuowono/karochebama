import { Router } from 'express';
import { ProjectController } from './controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { createProjectSchema, updateProjectSchema, getProjectSchema } from './validation';

const router = Router();
const controller = new ProjectController();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

router.get('/', controller.getAll);
router.get('/:id', validateRequest(getProjectSchema), controller.getById);
router.post('/', validateRequest(createProjectSchema), controller.create);
router.put('/:id', validateRequest(getProjectSchema), validateRequest(updateProjectSchema), controller.update);
router.delete('/:id', validateRequest(getProjectSchema), controller.delete);

export default router;
