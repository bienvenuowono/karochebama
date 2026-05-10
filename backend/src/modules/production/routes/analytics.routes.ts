import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';

export class AnalyticsController {
  getDashboardStats = async (req: Request, res: Response) => {
    try {
      const [
        orders,
        categories,
        sites,
        usersCount,
        messages
      ] = await Promise.all([
        // 1. Commandes + Détails Clients
        prisma.order.findMany({
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                // On peut ajouter ici les champs pays/whatsapp s'ils existent dans User
              }
            },
            items: { include: { product: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        // 2. Catégories + Statuts des produits
        prisma.category.findMany({
          include: {
            products: {
              select: { status: true }
            }
          }
        }),
        // 3. Sites de culture
        prisma.cultureSite.findMany({
          include: { region: true, products: true }
        }),
        // 4. Nombre de clients
        prisma.user.count({ where: { role: 'USER' } }),
        // 5. Messages de contact
        prisma.contactMessage.findMany({
          orderBy: { createdAt: 'desc' }
        })
      ]);

      // Transformation pour le Dashboard
      const categoryHealth = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        stats: {
          en_production: cat.products.filter(p => p.status === 'en_production').length,
          disponible: cat.products.filter(p => p.status === 'disponible').length,
          epuise: cat.products.filter(p => p.status === 'epuise').length,
        }
      }));

      res.json({
        success: true,
        data: {
          orders: {
            total: orders.length,
            list: orders
          },
          categories: {
            total: categories.length,
            health: categoryHealth
          },
          sites: {
            total: sites.length,
            list: sites
          },
          clients: {
            total: usersCount
          },
          messages: {
            total: messages.filter(m => !m.isRead).length,
            list: messages
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

const router = Router();
const controller = new AnalyticsController();

router.get('/dashboard-stats', controller.getDashboardStats);

export default router;
