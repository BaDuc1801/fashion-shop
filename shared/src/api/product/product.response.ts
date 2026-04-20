import { Category } from '../category/category.response';
import { ProductSizeVariant } from './product.request';
import { RatingResponse, RatingStatsResponse } from '../rating/rating.response';

export interface Product {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  categoryId: Category;
  sku: string;
  price: number;
  status: string;
  stock: number;
  images: string[];
  sizeVariants: ProductSizeVariant[];
  createdAt: string;
  updatedAt: string;
  inWishlist?: boolean;
  ratingStats: RatingStatsResponse;
  reviews: RatingResponse[];
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

export interface BestSellerProduct {
  totalSold: number;
  totalRevenue: number;
  productId: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  nameEn: string;
}

export interface BestSellerProductResponse {
  data: BestSellerProduct[];
  total: number;
  page: number;
  totalPages: number;
}
