export interface SendOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface GetUsersRequest {
  search?: string;
  page?: number;
  limit?: number;
  role?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  salary?: number;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface InviteUserRequest {
  name: string;
  email: string;
  phone?: string;
  salary?: number;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive';
  joinDate?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  salary?: number;
  avatar?: string;
  role?: string;
  status?: 'active' | 'inactive';
}
