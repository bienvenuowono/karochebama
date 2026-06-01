export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number; // Prix dynamique (calculé)
  originalPrice: number; // Prix d'origine enregistré en base
  stockRegime: number; // Stock dynamique calculé en Régime
  stockTonnes: number; // Stock dynamique calculé en Tonnes
  categoryId: string;
  category?: CategoryDTO;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  price: number;
  sku?: string;
  description?: string;
  categoryId: string;
  imageUrl?: string;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  sku?: string;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
}
