import { useMutation } from '@tanstack/react-query';
import { api, type ResendOtpResponse } from '@shared';

export const useResendOtp = () =>
  useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post('/api/users/resend-otp', { email });
      return res.data as ResendOtpResponse;
    },
  });
