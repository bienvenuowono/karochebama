import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../services/apiClient';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/products');
  return response.data.data;
};

const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await apiClient.post('/products', product);
  return response.data.data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidation automatique du cache local lors d'une écriture
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
