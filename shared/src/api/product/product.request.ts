export interface ProductSku {
  size: string;
  quantity: number;
  reserved?: number;
  sold?: number;
}

export interface ProductVariant {
  color: string;
  images: string[];
  skus: ProductSku[];
}
export interface CreateProductRequest {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  categoryId: string;
  sku: string;
  price: number;
  status?: string;
  variants: ProductVariant[];
}
export interface UpdateProductRequest {
  name?: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  categoryId?: string;
  sku?: string;
  price?: number;
  status?: string;
  variants?: ProductVariant[];
}

export interface GetProductsRequest {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  search?: string;
  categoryName?: string;
  categoryNameEn?: string;
  categoryId?: string;
  categorySlug?: string;
  sortPrice?: 'asc' | 'desc';
  lang?: string;
}
