import { z } from 'zod';

export const siteSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  type: z.string().min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export type SiteInput = z.infer<typeof siteSchema>;
