import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';

export class ReportingController {
  getFinancialReport = async (req: Request, res: Response) => {
    try {
      const [
        monthlySales,
        topProducts,
        revenueBySite,
        yieldByCategory
      ] = await Promise.all([
        // 1. Ventes mensuelles (6 derniers mois)
        prisma.$queryRaw`
          SELECT 
            DATE_FORMAT(createdAt, '%Y-%m') as month,
            SUM(totalAmount) as amount
          FROM \`Order\`
          WHERE status = 'PAID'
          GROUP BY month
          ORDER BY month DESC
          LIMIT 6
        `,
        // 2. Top 5 Produits les plus vendus
        prisma.orderItem.groupBy({
          by: ['productId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5
        }),
        // 3. Revenus (Placeholder simplifié par type de produit)
        prisma.product.groupBy({
          by: ['typeId'],
          _sum: { quantityKg: true },
        }),
        // 4. Rendement moyen par catégorie
        prisma.category.findMany({
          include: {
            products: {
              include: {
                harvests: true
              }
            }
          }
        })
      ]);

      // Enrichissement des Top Produits avec les noms
      const topProductsDetailed = await Promise.all(
        (topProducts as any[]).map(async (item) => {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          return { name: product?.name, quantity: item._sum.quantity };
        })
      );

      res.json({
        success: true,
        data: {
          monthlySales,
          topProducts: topProductsDetailed,
          // Autres stats formatées...
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

const router = Router();
const controller = new ReportingController();

router.get('/financial-summary', controller.getFinancialReport);

export default router;
