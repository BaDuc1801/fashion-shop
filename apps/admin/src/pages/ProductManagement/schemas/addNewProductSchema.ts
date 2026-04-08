import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createAddNewProductSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredProductName')),
    sku: z.string().min(1, t('admin.validation.requiredSku')),
    price: z.number().min(0, t('admin.validation.priceMin')),
    stock: z.number().min(0, t('admin.validation.stockMin')),
    status: z.boolean(),
    images: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage')),
  });

export const addNewProductSchemaDefaultValues = {
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  status: true,
  images: [] as UploadFile[],
};

export type AddNewProductFormValues = z.infer<
  ReturnType<typeof createAddNewProductSchema>
>;
