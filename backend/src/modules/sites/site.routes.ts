import { Router } from 'express';
import siteController from './site.controller';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

router.get('/', siteController.getAll);
router.get('/:id', siteController.getById);
router.post('/', authenticate, authorize(['ADMIN']), siteController.create);
router.put('/:id', authenticate, authorize(['ADMIN']), siteController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), siteController.delete);

export default router;
