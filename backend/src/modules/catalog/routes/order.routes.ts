import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';

export class OrderController {
  create = async (req: Request, res: Response) => {
    try {
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

        // Réduction immédiate des stocks lors de la réservation
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
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
      const order = await prisma.order.update({
        where: { id: parseInt(id as string) },
        data: { status }
      });
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

const router = Router();
const controller = new OrderController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.patch('/:id/status', controller.updateStatus);

export default router;
