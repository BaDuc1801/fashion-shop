import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createCategoryFormSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredCategoryName')),
    slug: z.string().min(1, t('admin.validation.requiredSlug')),
    status: z.boolean(),
    images: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage')),
    productCount: z.number().min(0, t('admin.validation.requiredProductCount')),
  });

export const categoryFormSchemaDefaultValues = {
  name: '',
  slug: '',
  status: true,
  images: [] as UploadFile[],
  productCount: 0,
};

export type CategoryFormValues = z.infer<
  ReturnType<typeof createCategoryFormSchema>
>;
