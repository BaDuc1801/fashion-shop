import api from '../axios';
import { SendOtpRequest, RegisterRequest } from './user.request';
import { SendOtpResponse, RegisterResponse } from './user.response';

class UserService {
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
