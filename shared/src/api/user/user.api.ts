import api from '../axios';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from './user.request';
import {
  ChangePasswordResponse,
  LoginApiResponse,
  ResetPasswordResponse,
  ResendOtpResponse,
  RegisterResponse,
  SendOtpResponse,
  UserMeApiResponse,
  VerifyOtpResponse,
} from './user.response';

class UserService {
  async login(payload: LoginRequest): Promise<LoginApiResponse> {
    const res = await api.post('/api/users/login', payload);
    return res.data;
  }

  async getCurrentUser(): Promise<UserMeApiResponse> {
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
}

export const userService = new UserService();
