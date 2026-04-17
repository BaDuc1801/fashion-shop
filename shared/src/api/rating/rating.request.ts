export interface CreateRatingRequest {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
  images: string[];
}

export interface UpdateRatingRequest {
  rating: number;
  comment: string;
  images: string[];
}
