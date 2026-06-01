import { Router } from 'express';
import { OrderController } from './controller';
import { requireAuth, requireRole } from '../../core/middlewares/auth.middleware';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { createOrderSchema, updateOrderStatusSchema, getOrderSchema } from './validation';

const router = Router();
const controller = new OrderController();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// Lister toutes les commandes (accessible à tous les employés autorisés ?)
// Pour l'instant on limite à l'Admin, mais ça pourrait être 'USER' si on veut.
router.get('/', requireRole(['ADMIN']), controller.getAll);

// Détail d'une commande
router.get('/:id', requireRole(['ADMIN']), validateRequest(getOrderSchema), controller.getById);

// Créer une commande
router.post('/', requireRole(['ADMIN']), validateRequest(createOrderSchema), controller.create);

// Changer le statut (et déclencher la facture)
router.put('/:id/status', requireRole(['ADMIN']), validateRequest(getOrderSchema), validateRequest(updateOrderStatusSchema), controller.updateStatus);

export default router;
