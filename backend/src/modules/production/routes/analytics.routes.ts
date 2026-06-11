import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';

export class AnalyticsController {
  getDashboardStats = async (req: Request, res: Response) => {
    try {
      const [
        orders,
        categories,
        sites,
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
          include: { geographicZone: true, products: true }
        }),
        // 4. Messages de contact
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

      // Extraire les clients uniques à partir des commandes
      const uniqueClientsMap = new Map<string, any>();
      orders.forEach((o: any) => {
        const phone = o.customerPhone || '';
        const email = o.customerEmail || '';
        const name = o.customerName || '';
        const key = (phone || email || name || '').toLowerCase().trim();
        if (key && !uniqueClientsMap.has(key)) {
          uniqueClientsMap.set(key, {
            id: o.id,
            firstName: o.customerName || 'Client',
            lastName: '',
            email: o.customerEmail || 'N/A',
            phone: o.customerPhone || 'N/A',
            whatsapp: o.customerWhatsapp || 'N/A',
            country: o.customerCountry || 'N/A',
            address: o.shippingAddress || 'N/A'
          });
        }
      });
      const clientsList = Array.from(uniqueClientsMap.values());

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
            total: clientsList.length,
            list: clientsList
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
