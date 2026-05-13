export type RecommendationType =
  | 'trending'
  | 'hybrid'
  | 'folding_in'
  | string;

export interface RecommendationReason {
  reason: string;
}

export interface RecommendationProduct {
  _id: string;
  sku: string;
  name: string;
  nameEn?: string;
  price: number;
  // Hybrid recommendations contain `variants`, while the public trending endpoint
  // may return a simpler shape.
  variants?: Array<{
    images: string[];
  }>;
  images?: string[];
  explanation?: RecommendationReason;
}

export interface RecommendationMeta {
  total: number;
  user_id?: string;
}

export interface RecommendationProductsResponse {
  success: boolean;
  type: RecommendationType;
  cold_start?: boolean;
  message?: string;
  products: RecommendationProduct[];
  meta?: RecommendationMeta;
}

