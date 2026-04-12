export interface SendOtpResponse {
  message: string;
}

export interface LoginResponseData {
  accessToken?: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginApiResponse {
  message?: string;
  data?: LoginResponseData;
  timestamp?: string;
}

export interface UserMeData {
  userId?: string;
  id?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export interface UserMeApiResponse {
  message?: string;
  data?: UserMeData;
  timestamp?: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
  userId?: string;
  data?: {
    token?: string;
    userId?: string;
    email?: string;
    fullName?: string;
    role?: string;
  };
}
