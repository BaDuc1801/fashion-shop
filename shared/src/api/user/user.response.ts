export interface SendOtpResponse {
  message: string;
}

export interface LoginResponse {
  message?: string;
  token?: string;
  userId?: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
  userId?: string;
}
