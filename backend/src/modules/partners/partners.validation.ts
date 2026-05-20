import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2), // producteur, distributeur, logistique, autre
  email: z.string().email(),
  phone: z.string().min(4),
  location: z.string().min(2),
  description: z.string().min(5),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
