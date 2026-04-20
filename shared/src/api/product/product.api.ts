import api from '../axios';
import {
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsRequest,
} from './product.request';

import {
  GetProductsResponse,
  Product,
  DeleteProductResponse,
  BestSellerProductResponse,
} from './product.response';

class ProductService {
  async createProduct(payload: CreateProductRequest): Promise<Product> {
    const res = await api.post('/api/products', payload);
    return res.data;
  }

  async getProducts(params: GetProductsRequest): Promise<GetProductsResponse> {
    const res = await api.get('/api/products', { params });
    return res.data;
  }

  async getProductById(id: string): Promise<Product> {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  }

  async getProductBySku(sku: string, lang?: string): Promise<Product> {
    const res = await api.get(`/api/products/sku/${sku}`, {
      params: { lang },
    });
    return res.data;
  }

  async updateProduct(
    id: string,
    payload: UpdateProductRequest,
  ): Promise<Product> {
    const res = await api.put(`/api/products/${id}`, payload);
    return res.data;
  }

  async deleteProduct(id: string): Promise<DeleteProductResponse> {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  }

  async getBestSellerProducts(params: {
    page: number;
    limit: number;
  }): Promise<BestSellerProductResponse> {
    const res = await api.get('/api/products/admin/top-purchased', { params });
    return res.data;
  }
}

export const productService = new ProductService();
