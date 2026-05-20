export interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  address?: string | null;
  photoUrl?: string | null;
  role: 'ADMIN' | 'USER' | 'MANAGER';
  createdAt: string;
  updatedAt: string;
}

export interface GeographicZone {
  id: number;
  name: string;
  cultureSites?: CultureSite[];
  createdAt: string;
}

export interface CultureSite {
  id: number;
  name: string;
  geographicZoneId: number;
  geographicZone?: GeographicZone;
  products?: ProductSite[];
  harvests?: Harvest[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  varieties?: ProductVariety[];
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: number;
  name: string;
  products?: Product[];
  createdAt: string;
}

export interface ProductVariety {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  imageUrl?: string | null;
  gallery?: string[] | null;
  typeId: number;
  type?: ProductType;
  categoryId: number;
  category?: Category;
  varietyId?: number | null;
  variety?: ProductVariety | null;
  sowingDate?: string | null;
  maturityDate?: string | null;
  quantityKg?: number | null;
  quantityTonne?: number | null;
  priceKg?: number | string | null;
  priceTonne?: number | string | null;
  status: 'en_production' | 'disponible' | 'indisponible';
  sites?: ProductSite[];
  harvests?: Harvest[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSite {
  productId: number;
  siteId: number;
  product?: Product;
  site?: CultureSite;
}

export interface Harvest {
  id: number;
  productId: number;
  product?: Product;
  siteId: number;
  site?: CultureSite;
  quantity: number;
  unit: string;
  harvestDate: string;
  status: 'COMPLETED' | 'PENDING';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number | string;
}

export interface Order {
  id: number;
  userId?: number | null;
  user?: User | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerWhatsapp?: string | null;
  customerCountry?: string | null;
  shippingAddress?: string | null;
  notes?: string | null;
  totalAmount: number | string;
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  isProcessed: boolean;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  date?: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: 'ONGOING' | 'COMPLETED' | 'PLANNED';
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: number;
  title?: string | null;
  description?: string | null;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  publishedAt?: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface CommercialForm {
  id: number;
  type: 'COMMERCIAL' | 'DEMARCHEUR';
  agentName: string;
  clientName: string;
  contact?: string | null;
  product: string;
  quantity: string;
  location: string;
  comment?: string | null;
  isProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerApplication {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  isProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}
