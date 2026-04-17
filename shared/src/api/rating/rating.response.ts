import { Product } from '../product/product.response';
import { UserMeData } from '../user/user.response';

export interface RatingStatsResponse {
  avgRating: number;
  totalRatings: number;
}

export interface RatingResponse {
  _id: string;
  userId: UserMeData;
  productId: Product;
  rating: number;
  comment: string;
  images: string[];
  isPublic: boolean;
  verifiedPurchase: boolean;
  updatedAt: string;
}

export interface RatingAdminResponse {
  data: RatingResponse[];
  total: number;
}
