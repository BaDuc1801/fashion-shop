import api from '../axios';
import { LoginRequest, RegisterRequest, SendOtpRequest } from './user.request';
import {
  LoginApiResponse,
  RegisterResponse,
  SendOtpResponse,
  UserMeApiResponse,
} from './user.response';

class UserService {
  async login(payload: LoginRequest): Promise<LoginApiResponse> {
    const res = await api.post('/api/v1/auth/login', payload);
    return res.data;
  }

  async getCurrentUser(): Promise<UserMeApiResponse> {
    const res = await api.get('/api/v1/users/me');
    return res.data;
  }

  async sendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
    const res = await api.post('/api/v1/auth/send-register-otp', payload);
    return res.data;
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const res = await api.post('/api/v1/auth/register', payload);
    return res.data;
  }
}

export const userService = new UserService();
