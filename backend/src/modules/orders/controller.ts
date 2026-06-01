import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { OrderUseCase } from './use-case';

export class OrderController extends BaseController {
  private orderUseCase: OrderUseCase;

  constructor(orderUseCase = new OrderUseCase()) {
    super();
    this.orderUseCase = orderUseCase;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderUseCase.getOrders(req.organizationId!);
      this.sendSuccess(res, orders, 'Commandes récupérées avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderUseCase.getOrderById(req.params.id, req.organizationId!);
      this.sendSuccess(res, order, 'Commande récupérée avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderUseCase.createOrder(req.user!.id, req.organizationId!, req.body);
      this.sendCreated(res, order, 'Commande créée avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.body;
      const order = await this.orderUseCase.updateOrderStatus(req.params.id, status, req.organizationId!);
      this.sendSuccess(res, order, 'Statut de la commande mis à jour.');
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
