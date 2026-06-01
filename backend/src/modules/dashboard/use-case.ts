import prisma from '../../config/database';

export class DashboardUseCase {

  /**
   * Récupère les KPI globaux de l'organisation
   */
  public async getGlobalKPIs(organizationId: string) {
    // 1. Chiffre d'Affaires Total (Somme des factures PAYÉES)
    const revenueAggregation = await prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        organizationId,
        status: 'PAID',
        deletedAt: null,
      },
    });

    // 2. Nombre total de projets actifs
    const activeProjectsCount = await prisma.project.count({
      where: {
        organizationId,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    // 3. Nombre d'employés
    const totalUsersCount = await prisma.user.count({
      where: {
        organizationId,
        deletedAt: null,
      },
    });

    // 4. Produits en alerte (pas encore de gestion de stock DB stricte, on se base sur les récoltes vs commandes)
    // Pour simplifier l'exemple KPI : total de produits enregistrés
    const totalProductsCount = await prisma.product.count({
      where: {
        organizationId,
        deletedAt: null,
      },
    });

    return {
      totalRevenue: revenueAggregation._sum.amount ? Number(revenueAggregation._sum.amount) : 0,
      activeProjects: activeProjectsCount,
      totalUsers: totalUsersCount,
      totalProducts: totalProductsCount,
    };
  }

  /**
   * Récupère les données de revenus par mois (pour un graphique)
   * On simule un tableau de 12 mois.
   */
  public async getRevenueChart(organizationId: string) {
    // Récupérer toutes les factures payées de cette année
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    
    const invoices = await prisma.invoice.findMany({
      where: {
        organizationId,
        status: 'PAID',
        deletedAt: null,
        issuedAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        issuedAt: true,
      },
    });

    // Initialiser les 12 mois à 0
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const revenueByMonth = months.map(name => ({ name, revenue: 0 }));

    // Agréger les montants
    for (const inv of invoices) {
      const monthIndex = inv.issuedAt.getMonth(); // 0-11
      revenueByMonth[monthIndex].revenue += Number(inv.amount);
    }

    return revenueByMonth;
  }
}

export default DashboardUseCase;
