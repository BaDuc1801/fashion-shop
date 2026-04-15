export interface SendOtpResponse {
  message: string;
  otpExpiresAt?: string;
  serverTime?: string;
}

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  sku: string;
}

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  size: string;
  color: string;
  quantity: number;
}

export interface LoginApiResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    addresses: unknown[];
    role: string;
    provider: string;
    isVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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
  addresses: unknown[];
  role: string;
  provider: string;
  isVerified: boolean;
  status: string;
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
    addresses: unknown[];
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
