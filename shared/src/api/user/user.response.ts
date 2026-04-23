import { ProductVariant } from '../product/product.request';
import { Product } from '../product/product.response';

export interface SendOtpResponse {
  message: string;
  otpExpiresAt?: string;
  serverTime?: string;
}

export interface WishlistItem {
  _id: string;
  name: string;
  nameEn: string;
  price: number;
  variants: ProductVariant[];
  sku: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface PurchaseHistoryItem {
  orderId: string;
  purchasedAt: string;
  totalAmount: number;
  status: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    size: string;
    color: string;
  }[];
}

export interface LoginApiResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    address: string;
    phone: string;
    role: string;
    provider?: string;
    isVerified?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
  token: string;
}

export interface UserMeData {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  salary?: number;
  address: string;
  role: string;
  provider: string;
  isVerified: boolean;
  status: string;
  purchaseHistory: PurchaseHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UserMeApiResponse {
  message?: string;
  data?: UserMeData;
  timestamp?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    salary?: number;
    address: string;
    role: string;
    provider: string;
    isVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  otpExpiresAt: string;
  serverTime: string;
}

export interface VerifyOtpResponse {
  message: string;
  token?: string;
}

export interface ResendOtpResponse {
  message: string;
  otpExpiresAt?: string;
  serverTime?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface GetUsersResponse {
  data: UserMeData[];
  total: number;
  page?: number;
  totalPages?: number;
}
