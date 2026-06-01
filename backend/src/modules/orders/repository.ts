import { IsolatedBaseRepository } from '../../core/base/baseRepository';
import prisma from '../../config/database';
import { Order, Prisma } from '@prisma/client';

export class OrderRepository extends IsolatedBaseRepository<
  Order,
  Prisma.OrderCreateWithoutOrganizationInput,
  Prisma.OrderUpdateInput
> {
  constructor() {
    super(prisma.order);
  }

  /**
   * Récupérer toutes les commandes avec leurs items et la facture associée
   */
  public async findAllWithDetails(organizationId: string) {
    return this.modelDelegate.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        invoice: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Récupérer une commande spécifique avec détails
   */
  public async findByIdWithDetails(id: string, organizationId: string) {
    return this.modelDelegate.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        invoice: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });
  }

  /**
   * Mettre à jour le statut
   */
  public async updateStatus(id: string, status: string, organizationId: string) {
    return this.modelDelegate.update({
      where: { id, organizationId },
      data: { status }
    });
  }

  /**
   * Créer une facture pour une commande
   */
  public async createInvoice(orderId: string, organizationId: string, amount: number) {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Echéance à 30 jours
    
    // Générer un numéro de facture basé sur le timestamp pour être unique
    const invoiceNumber = `INV-${today.getFullYear()}-${Math.floor(Date.now() / 1000)}`;

    return prisma.invoice.create({
      data: {
        orderId,
        organizationId,
        invoiceNumber,
        amount,
        status: 'PAID', // Puisque généré lors du passage en PAID
        dueDate,
      }
    });
  }
}

export default OrderRepository;
