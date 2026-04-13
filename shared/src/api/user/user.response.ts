export interface SendOtpResponse {
  message: string;
  otpExpiresAt?: string;
  serverTime?: string;
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
