import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().min(5),
});

export type ContactInput = z.infer<typeof contactSchema>;
