import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  wholesalePrice: z.number().positive().optional(),
  minWholesaleQty: z.number().int().positive().optional(),
  unit: z.string().default('kg'),
  categoryId: z.string().uuid(),
  siteId: z.string().uuid().optional(),
  status: z.enum(['active', 'draft', 'out_of_stock']).default('active'),
  imageUrl: z.string().url().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
