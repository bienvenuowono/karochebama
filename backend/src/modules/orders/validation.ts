import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid('ID de produit invalide'),
        quantity: z.number().positive('La quantité doit être supérieure à 0'),
      })
    ).min(1, 'La commande doit contenir au moins un produit'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'REFUNDED'], {
      errorMap: () => ({ message: 'Statut de commande invalide' }),
    }),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de commande invalide'),
  }),
});
