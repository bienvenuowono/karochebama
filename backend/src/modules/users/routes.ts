import { Router } from 'express';
import { UserController } from './controller';
import { requireAuth, requireRole } from '../../core/middlewares/auth.middleware';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { updateProfileSchema, createUserSchema } from './validation';

const router = Router();
const controller = new UserController();

// Toutes les routes utilisateur nécessitent une authentification
router.use(requireAuth);

// Profil de l'utilisateur connecté
router.get('/me', controller.getMe);
router.put('/me', validateRequest(updateProfileSchema), controller.updateMe);

// ─── Routes Admin ────────────────────────────────────────────────────────────

// Seuls les admins peuvent gérer les autres utilisateurs de l'organisation
router.get('/', requireRole(['ADMIN']), controller.getAll);
router.post('/', requireRole(['ADMIN']), validateRequest(createUserSchema), controller.create);
router.delete('/:id', requireRole(['ADMIN']), controller.delete);

export default router;
