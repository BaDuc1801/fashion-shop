import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { resolveImageUrls, voucherService } from '@shared';
import { VoucherFormValues } from '../schema/createVoucherFormSchema';

type UseUpdateVoucherParams = {
  voucherId?: string;
  currentVoucherId?: string;
};

export const useUpdateVoucher = ({
  voucherId,
  currentVoucherId,
}: UseUpdateVoucherParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: VoucherFormValues) => {
      if (!voucherId) {
        throw new Error('Missing voucher id');
      }

      const imageUrls = await resolveImageUrls(values.image);
      return voucherService.updateVoucher(voucherId, {
        code: values.code,
        discountPercent: values.discountPercent,
        maxDiscount: values.maxDiscount,
        minOrderValue: values.minOrderValue,
        expiresAt: values.expiresAt.toISOString(),
        status: values.status ? 'active' : 'inactive',
        image: imageUrls[0],
      });
    },
    onSuccess: async () => {
      message.success(t('admin.voucher.form.updateSuccess'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['vouchers'] }),
        queryClient.invalidateQueries({
          queryKey: ['vouchers', 'detail-by-id', currentVoucherId ?? voucherId],
        }),
      ]);
    },
    onError: () => {
      message.error(t('admin.voucher.form.updateFailed'));
    },
  });
};
