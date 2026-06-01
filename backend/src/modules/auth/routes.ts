import { Router } from 'express';
import { register, login, logout, getMe, refresh } from './controller';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { registerSchema, loginSchema } from './validation';
import { requireAuth } from '../../core/middlewares/auth.middleware';

const router = Router();

// ─── Routes Publiques ────────────────────────────────────────────────────────

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refresh);

// ─── Routes Protégées ────────────────────────────────────────────────────────

router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

export default router;
