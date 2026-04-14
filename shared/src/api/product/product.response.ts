import { Category } from '../category/category.response';
import { ProductSizeVariant } from './product.request';

export interface Product {
  _id: string;
  name: string;
  categoryId: Category;
  sku: string;
  price: number;
  status: string;
  stock: number;
  images: string[];
  sizeVariants: ProductSizeVariant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetProductsResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DeleteProductResponse {
  message: string;
}
