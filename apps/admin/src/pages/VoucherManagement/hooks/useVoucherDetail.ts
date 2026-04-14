import { useEffect } from 'react';
import type { UploadFile } from 'antd';
import type { CreateVoucherRequest } from '@shared';
import type { UseFormReset } from 'react-hook-form';
import dayjs from 'dayjs';
import { VoucherFormValues } from '../schema/createVoucherFormSchema';

type UseVoucherDetailArgs = {
  initialValues?: CreateVoucherRequest;
  reset: UseFormReset<VoucherFormValues>;
};

export const useVoucherDetail = ({
  initialValues,
  reset,
}: UseVoucherDetailArgs) => {
  useEffect(() => {
    if (!initialValues) return;

    reset({
      code: initialValues.code,
      discountPercent: initialValues.discountPercent,
      maxDiscount: initialValues.maxDiscount,
      minOrderValue: initialValues.minOrderValue,
      expiresAt: dayjs(initialValues.expiresAt),
      status: initialValues.status === 'active',
      image: initialValues.image
        ? [
            {
              uid: initialValues.code,
              name: initialValues.code,
              status: 'done',
              url: initialValues.image,
            } as UploadFile,
          ]
        : [],
    });
  }, [initialValues, reset]);
};
