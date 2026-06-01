import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { DashboardUseCase } from './use-case';

export class DashboardController extends BaseController {
  private dashboardUseCase: DashboardUseCase;

  constructor(dashboardUseCase = new DashboardUseCase()) {
    super();
    this.dashboardUseCase = dashboardUseCase;
  }

  public getKPIs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const kpis = await this.dashboardUseCase.getGlobalKPIs(req.organizationId!);
      this.sendSuccess(res, kpis, 'KPIs récupérés avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public getRevenue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chartData = await this.dashboardUseCase.getRevenueChart(req.organizationId!);
      this.sendSuccess(res, chartData, 'Données du graphique de revenus récupérées.');
    } catch (error) {
      next(error);
    }
  };
}

export default DashboardController;
