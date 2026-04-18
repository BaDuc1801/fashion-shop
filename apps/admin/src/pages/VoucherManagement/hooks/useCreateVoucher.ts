import { CreateVoucherRequest, voucherService } from '@shared';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useCreateVoucher = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: CreateVoucherRequest) => {
      const created = await voucherService.createVoucher(values);
      return created;
    },
    onSuccess: (created) => {
      message.success(t('admin.voucher.form.createSuccess'));
      navigate(`/vouchers/${created._id}`);
    },
    onError: () => {
      message.error(t('admin.voucher.form.createFailed'));
    },
  });
};
