export interface SendOtpRequest {
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  otp: string;
}
