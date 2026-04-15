import api from '../axios';
import {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  GetUsersRequest,
  InviteUserRequest,
} from './user.request';
import {
  ChangePasswordResponse,
  LoginApiResponse,
  ResetPasswordResponse,
  ResendOtpResponse,
  RegisterResponse,
  SendOtpResponse,
  UserMeData,
  VerifyOtpResponse,
  GetUsersResponse,
  WishlistItem,
  CartItem,
} from './user.response';

class UserService {
  async login(payload: LoginRequest): Promise<LoginApiResponse> {
    const res = await api.post('/api/users/login', payload);
    return res.data;
  }

  async getCurrentUser(): Promise<UserMeData> {
    const res = await api.get('/api/users/me');
    return res.data;
  }

  async sendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
    const res = await api.post('/api/users/send-otp', payload);
    return res.data;
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const res = await api.post('/api/users/register', payload);
    return res.data;
  }

  async verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const res = await api.post('/api/users/verify-otp', payload);
    return res.data;
  }

  async resendOtp(payload: ResendOtpRequest): Promise<ResendOtpResponse> {
    const res = await api.post('/api/users/resend-otp', payload);
    return res.data;
  }

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const res = await api.post('/api/users/reset-password', payload);
    return res.data;
  }

  async changePassword(
    payload: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const res = await api.put('/api/users/me/password', payload);
    return res.data;
  }

  async getUsers(queryParams: GetUsersRequest): Promise<GetUsersResponse> {
    const res = await api.get('/api/users', { params: queryParams });
    return res.data;
  }

  async getUserById(id: string): Promise<UserMeData> {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  }

  async createUser(payload: CreateUserRequest): Promise<UserMeData> {
    const res = await api.post('/api/users', payload);
    return res.data;
  }

  async inviteUser(payload: InviteUserRequest): Promise<UserMeData> {
    const res = await api.post('/api/users/invite', payload);
    return res.data;
  }

  async updateUser(
    id: string,
    payload: UpdateUserRequest,
  ): Promise<UserMeData> {
    const res = await api.put(`/api/users/${id}`, payload);
    return res.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  }

  async addToWishlist(productId: string): Promise<{ message: string }> {
    const res = await api.post(`/api/users/wishlist`, { productId });
    return res.data;
  }

  async removeFromWishlist(productId: string): Promise<{ message: string }> {
    const res = await api.delete(`/api/users/wishlist/${productId}`);
    return res.data;
  }

  async getWishlist(): Promise<WishlistItem[]> {
    const res = await api.get(`/api/users/me/wishlist`);
    return res.data;
  }

  async getCart(): Promise<CartItem[]> {
    const res = await api.get(`/api/users/me/cart`);
    return res.data;
  }

  async addToCart(payload: {
    productId: string;
    size: string;
    color: string;
    quantity?: number;
  }): Promise<{ message: string; cart: CartItem[] }> {
    const res = await api.post(`/api/users/cart`, payload);
    return res.data;
  }

  async updateCartItem(payload: {
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }): Promise<{ message: string; cart: CartItem[] }> {
    const res = await api.put(`/api/users/me/cart`, payload);
    return res.data;
  }

  async removeFromCart(payload: {
    productId: string;
    size: string;
    color: string;
  }): Promise<{ message: string; cart: CartItem[] }> {
    const res = await api.delete(`/api/users/cart/${payload.productId}`, {
      data: {
        size: payload.size,
        color: payload.color,
      },
    });
    return res.data;
  }
}

export const userService = new UserService();
