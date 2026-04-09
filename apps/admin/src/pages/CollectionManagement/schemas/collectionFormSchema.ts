import dayjs from 'dayjs';
import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createCollectionFormSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredCollectionName')),
    slug: z.string().min(1, t('admin.validation.requiredSlug')),
    images: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage')),
    productsCount: z.number().min(0, t('admin.validation.productsCountMin')),
    startDate: z.custom<dayjs.Dayjs>(
      (value) => dayjs.isDayjs(value),
      t('admin.validation.selectStartDate'),
    ),
    endDate: z.custom<dayjs.Dayjs>(
      (value) => dayjs.isDayjs(value),
      t('admin.validation.selectEndDate'),
    ),
    status: z.enum(['draft', 'active', 'expired', 'inactive']),
    featured: z.boolean(),
  });

export const collectionFormSchemaDefaultValues = {
  name: '',
  slug: '',
  images: [] as UploadFile[],
  productsCount: 0,
  startDate: undefined as unknown as dayjs.Dayjs,
  endDate: undefined as unknown as dayjs.Dayjs,
  status: 'draft' as const,
  featured: false,
};

export type CollectionFormValues = z.infer<
  ReturnType<typeof createCollectionFormSchema>
>;
