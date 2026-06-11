import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDTO } from '../dtos/product.dto';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getAllProducts(filters: any) {
    return this.repository.findAll(filters);
  }

  async createProduct(data: CreateProductDTO) {
    // CALCULS AUTOMATIQUES
    const quantityTonne = data.quantityTonne || data.quantityKg / 1000;
    const priceTonne = data.priceTonne || data.priceKg * 1000;
    
    // On mappe vers le prix par défaut pour la compatibilité
    const finalData = {
      ...data,
      quantityTonne,
      priceTonne,
      price: data.priceKg, // Prix de base au KG
      status: "en_production"
    };

    return this.repository.create(finalData);
  }

  async updateProduct(id: number, data: any) {
    // Calculs également lors de la mise à jour
    if (data.quantityKg && !data.quantityTonne) {
      data.quantityTonne = data.quantityKg / 1000;
    }
    if (data.priceKg && !data.priceTonne) {
      data.priceTonne = data.priceKg * 1000;
    }
    
    return this.repository.update(id, data);
  }

  async deleteProduct(id: number) {
    return this.repository.delete(id);
  }

  async getProductById(id: number) {
    return this.repository.findById(id);
  }
}
