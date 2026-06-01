import { Router } from 'express';
import { DashboardController } from './controller';
import { requireAuth, requireRole } from '../../core/middlewares/auth.middleware';

const router = Router();
const controller = new DashboardController();

// Seuls les administrateurs ont accès aux données financières et aux KPIs globaux
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/kpis', controller.getKPIs);
router.get('/revenue', controller.getRevenue);

export default router;
