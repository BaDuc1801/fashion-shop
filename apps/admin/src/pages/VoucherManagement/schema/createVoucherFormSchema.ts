import type { UploadFile } from 'antd';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createVoucherFormSchema = (t: TFunction) =>
  z.object({
    code: z.string().min(1, t('admin.validation.requiredVoucherCode')),
    discountPercent: z.number().min(1, t('admin.validation.requiredDiscount')),
    maxDiscount: z.number().min(0, t('admin.validation.requiredMaxDiscount')),
    minOrderValue: z.number().min(0, t('admin.validation.requiredMinOrder')),
    expiresAt: z.custom<dayjs.Dayjs>(
      (value) => dayjs.isDayjs(value) && value.isValid(),
      t('admin.validation.selectExpireDate'),
    ),
    status: z.boolean(),
    image: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage'))
      .optional(),
  });

export const voucherFormSchemaDefaultValues = {
  code: '',
  discountPercent: 0,
  maxDiscount: 0,
  minOrderValue: 0,
  expiresAt: dayjs().add(1, 'day'),
  status: true,
  image: [] as UploadFile[],
};

export type VoucherFormValues = z.infer<
  ReturnType<typeof createVoucherFormSchema>
>;
