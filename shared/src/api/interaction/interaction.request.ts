export type InteractionSource = 'organic' | 'recommendation' | 'search' | 'trending';

export interface TrackViewRequest {
  productId: string;
  source?: InteractionSource;
}

export interface TrackClickRequest {
  productId: string;
  source?: InteractionSource;
}

export interface TrackAddToCartRequest {
  productId: string;
}

export interface TrackPurchaseRequest {
  productIds: string[];
}

