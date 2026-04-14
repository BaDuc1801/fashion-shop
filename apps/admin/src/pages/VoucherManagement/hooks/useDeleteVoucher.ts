import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApiErrorResponse, voucherService } from '@shared';
import { AxiosError } from 'axios';

type UseDeleteVoucherParams = {
  voucherId?: string;
};

export const useDeleteVoucher = ({ voucherId }: UseDeleteVoucherParams) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!voucherId) {
        throw new Error('Missing voucher id');
      }
      return voucherService.deleteVoucher(voucherId);
    },
    onSuccess: async () => {
      message.success(t('admin.voucher.form.deleteSuccess'));
      await queryClient.cancelQueries({
        queryKey: ['vouchers', 'detail-by-id', voucherId],
      });
      queryClient.removeQueries({
        queryKey: ['vouchers', 'detail-by-id', voucherId],
      });
      await queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      navigate('/vouchers', { replace: true });
    },
    onError: (error: AxiosError) => {
      message.error((error.response?.data as ApiErrorResponse).message);
    },
  });
};
