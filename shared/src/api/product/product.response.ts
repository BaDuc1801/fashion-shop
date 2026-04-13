import { ProductSizeVariant } from './product.request';

export interface ProductData {
  _id: string;
  name: string;
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
  data: ProductData[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductResponse {
  _id: string;
  name: string;
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

export interface DeleteProductResponse {
  message: string;
}
