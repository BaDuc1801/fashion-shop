import { userService } from './user.api';
import { LoginRequest, RegisterRequest, SendOtpRequest } from './user.request';
import {
  LoginResponse,
  RegisterResponse,
  SendOtpResponse,
} from './user.response';
import { useMutation } from '@tanstack/react-query';

const useLoginMutation = () => {
  const mutation = useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (payload: LoginRequest) => userService.login(payload),
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

const useSendOtpMutation = () => {
  const mutation = useMutation<SendOtpResponse, unknown, SendOtpRequest>({
    mutationFn: (payload: SendOtpRequest) => userService.sendOtp(payload),
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

const useRegisterMutation = () => {
  const mutation = useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: (payload: RegisterRequest) => userService.register(payload),
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

export { useLoginMutation, useSendOtpMutation, useRegisterMutation };
