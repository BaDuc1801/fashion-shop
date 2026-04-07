import { userService } from './user.api';
import { RegisterRequest, SendOtpRequest } from './user.request';
import { RegisterResponse, SendOtpResponse } from './user.response';
import { useMutation } from '@tanstack/react-query';

const useSendOtpMutation = () => {
  return useMutation<SendOtpResponse, unknown, SendOtpRequest>({
    mutationFn: (payload: SendOtpRequest) => userService.sendOtp(payload),
  });
};

const useRegisterMutation = () => {
  return useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: (payload: RegisterRequest) => userService.register(payload),
  });
};

export { useSendOtpMutation, useRegisterMutation };
