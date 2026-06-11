import { z } from 'zod';

export const CreateProductSchema = z.object({
  typeId: z.number({ required_error: "Le type de produit est obligatoire" }),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  category: z.string().min(1, "La catégorie est obligatoire"),
  varietyId: z.number({ required_error: "La variété est obligatoire" }),
  siteId: z.number({ required_error: "Le site de culture est obligatoire" }),
  sowingDate: z.string().pipe(z.coerce.date()),
  maturityDate: z.string().pipe(z.coerce.date()),
  
  quantityKg: z.number().positive("La quantité en KG doit être positive"),
  quantityTonne: z.number().positive().optional(),
  
  priceKg: z.number().positive("Le prix au KG doit être positif"),
  priceTonne: z.number().positive().optional(),
  
  imageUrl: z.string().url("L'image principale est obligatoire"),
  gallery: z.array(z.string().url()).optional(),
  
  zoneIds: z.array(z.number()).min(1, "Au moins une zone de production est requise")
}).refine((data) => data.sowingDate < data.maturityDate, {
  message: "La date de semis doit être antérieure à la date de maturité",
  path: ["maturityDate"],
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
