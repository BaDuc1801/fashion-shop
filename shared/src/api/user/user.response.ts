export interface SendOtpResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
  userId?: string;
}
