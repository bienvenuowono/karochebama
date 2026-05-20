import prisma from '../config/prisma';

export async function recalculateProductStock(productId: number, tx: any = prisma): Promise<number> {
  // Somme des récoltes réelles
  const harvestAgg = await tx.harvest.aggregate({
    where: { productId },
    _sum: { quantity: true }
  });
  const totalHarvested = harvestAgg._sum.quantity || 0;

  // Somme des ventes confirmées (commandes dont le statut n'est pas CANCELLED)
  const salesAgg = await tx.orderItem.aggregate({
    where: {
      productId,
      order: {
        status: { notIn: ['CANCELLED'] }
      }
    },
    _sum: { quantity: true }
  });
  const totalSold = salesAgg._sum.quantity || 0;

  const currentStock = Math.max(0, Math.round(totalHarvested - totalSold));

  // Mise à jour de la colonne stock dans la table Product
  await tx.product.update({
    where: { id: productId },
    data: { stock: currentStock }
  });

  return currentStock;
}
