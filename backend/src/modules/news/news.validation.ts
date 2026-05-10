import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  imageUrl: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  status: z.string().default("PUBLISHED"),
});

export type ArticleInput = z.infer<typeof articleSchema>;
