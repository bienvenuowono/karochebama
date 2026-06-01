import { OrderRepository } from './repository';
import { NotFoundError } from '../../core/errors/appError';
import prisma from '../../config/database';
import { ProductUseCase } from '../products/use-case';

export class OrderUseCase {
  private orderRepository: OrderRepository;
  private productUseCase: ProductUseCase;

  constructor(
    orderRepository = new OrderRepository(),
    productUseCase = new ProductUseCase()
  ) {
    this.orderRepository = orderRepository;
    this.productUseCase = productUseCase;
  }

  public async getOrders(organizationId: string) {
    return this.orderRepository.findAllWithDetails(organizationId);
  }

  public async getOrderById(id: string, organizationId: string) {
    const order = await this.orderRepository.findByIdWithDetails(id, organizationId);
    if (!order) {
      throw new NotFoundError('Commande introuvable');
    }
    return order;
  }

  public async createOrder(userId: string, organizationId: string, input: any) {
    const { items } = input;

    // 1. Récupérer les prix actuels des produits (avec le calcul de prix dynamique)
    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      // Utilisation du productUseCase pour avoir le prix exact à l'instant T (avec la fluctuation)
      const product = await this.productUseCase.getProductById(item.productId, organizationId);
      
      const priceAtPurchase = product.price;
      const quantity = item.quantity;
      
      totalAmount += (priceAtPurchase * quantity);

      orderItemsData.push({
        productId: product.id,
        quantity,
        price: priceAtPurchase // Prix figé !
      });
    }

    // 2. Création de la commande avec transaction (Order + OrderItems)
    const newOrder = await prisma.order.create({
      data: {
        userId,
        organizationId,
        status: 'PENDING',
        totalAmount,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true
      }
    });

    return newOrder;
  }

  public async updateOrderStatus(id: string, status: string, organizationId: string) {
    const order = await this.orderRepository.findByIdWithDetails(id, organizationId);
    if (!order) {
      throw new NotFoundError('Commande introuvable');
    }

    // Si on passe en PAID et qu'il n'y a pas encore de facture
    if (status === 'PAID' && !order.invoice) {
      // On génère la facture automatiquement
      await this.orderRepository.createInvoice(order.id, organizationId, Number(order.totalAmount));
    }

    await this.orderRepository.updateStatus(id, status, organizationId);
    
    // Renvoyer la commande mise à jour avec les détails
    return this.orderRepository.findByIdWithDetails(id, organizationId);
  }
}

export default OrderUseCase;
