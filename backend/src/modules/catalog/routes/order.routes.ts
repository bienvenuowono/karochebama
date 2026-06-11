import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';
import { sanitizeObject } from '../../../utils/sanitize';
import { recalculateProductStock } from '../../../utils/stock';

export class OrderController {
  create = async (req: Request, res: Response) => {
    try {
      req.body = sanitizeObject(req.body);
      const { userId, customerName, customerEmail, customerPhone, customerWhatsapp, customerCountry, shippingAddress, notes, items, status = 'PENDING' } = req.body;
      
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Produit ${item.productId} introuvable`);
        if (product.stock < item.quantity) throw new Error(`Stock insuffisant pour ${product.name}`);

        totalAmount += Number(product.price) * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });
      }

      const invoiceNumber = `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const result = await prisma.$transaction(async (tx) => {
        // Création de la commande
        const order = await tx.order.create({
          data: {
            userId: userId ? parseInt(userId) : null,
            customerName,
            customerEmail,
            customerPhone,
            customerWhatsapp,
            customerCountry,
            shippingAddress,
            notes,
            totalAmount,
            status,
            // @ts-ignore
            items: { create: orderItemsData }
          },
          include: { items: true }
        });

        // Recalcul dynamique des stocks lors de la commande
        for (const item of items) {
          await recalculateProductStock(item.productId, tx);
        }

        return order;
      });

      res.status(201).json({ success: true, data: result, invoiceNumber });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const orderId = parseInt(id as string);
      
      const result = await prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { status },
          include: { items: true }
        });
        
        for (const item of updatedOrder.items) {
          await recalculateProductStock(item.productId, tx);
        }
        
        return updatedOrder;
      });
      
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateDiscount = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { discount } = req.body;
      const orderId = parseInt(id as string);

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Commande introuvable');
      if (order.status === 'PAID') throw new Error('Impossible de modifier une commande payée');

      const result = await prisma.order.update({
        where: { id: orderId },
        data: { discount: Number(discount) },
        include: { items: true }
      });

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

import { authenticate, authorize } from '../../../core/auth.middleware';

const router = Router();
const controller = new OrderController();

router.post('/', controller.create);
router.get('/', authenticate, authorize(['ADMIN']), controller.getAll);
router.put('/:id/status', authenticate, authorize(['ADMIN']), controller.updateStatus);
router.put('/:id/discount', authenticate, authorize(['ADMIN']), controller.updateDiscount);

export default router;
