import dayjs from 'dayjs';
import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createCategoryFormSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredCategoryName')),
    slug: z.string().min(1, t('admin.validation.requiredSlug')),
    productsCount: z.number().min(0, t('admin.validation.productsCountMin')),
    createdAt: z.custom<dayjs.Dayjs>(
      (value) => dayjs.isDayjs(value),
      t('admin.validation.selectDate'),
    ),
    status: z.boolean(),
    images: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage')),
  });

export const categoryFormSchemaDefaultValues = {
  name: '',
  slug: '',
  productsCount: 0,
  createdAt: undefined as unknown as dayjs.Dayjs,
  status: true,
  images: [] as UploadFile[],
};

export type CategoryFormValues = z.infer<ReturnType<typeof createCategoryFormSchema>>;
