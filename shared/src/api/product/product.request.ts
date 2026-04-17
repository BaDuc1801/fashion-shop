export interface ProductColorVariant {
  name: string;
  quantity: number;
}

export interface ProductSizeVariant {
  size: string;
  colors: ProductColorVariant[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: string;
  sku: string;
  price: number;
  status?: string;
  images?: string[];
  sizeVariants?: ProductSizeVariant[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  sku?: string;
  price?: number;
  status?: string;
  images?: string[];
  sizeVariants?: ProductSizeVariant[];
}

export interface GetProductsRequest {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  search?: string;
  categoryName?: string;
  categoryId?: string;
  categorySlug?: string;
  sortPrice?: 'asc' | 'desc';
}
