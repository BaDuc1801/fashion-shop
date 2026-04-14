import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

const productColorVariantSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredColorName')),
    quantity: z.number().min(0, t('admin.validation.stockMin')),
  });

const productSizeVariantSchema = (t: TFunction) =>
  z.object({
    size: z.string().min(1, t('admin.validation.requiredSize')),
    colors: z
      .array(productColorVariantSchema(t))
      .min(1, t('admin.validation.minOneColor')),
  });

export const createAddNewProductSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredProductName')),
    categoryId: z.string().min(1, t('admin.validation.requiredCategory')),
    sku: z.string().min(1, t('admin.validation.requiredSku')),
    price: z.number().min(0, t('admin.validation.priceMin')),
    status: z.boolean(),
    images: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage')),
    sizeVariants: z
      .array(productSizeVariantSchema(t))
      .min(1, t('admin.validation.minOneSize')),
  });

export const addNewProductSchemaDefaultValues = {
  name: '',
  categoryId: '',
  sku: '',
  price: 0,
  status: true,
  images: [] as UploadFile[],
  sizeVariants: [
    {
      size: '',
      colors: [{ name: '#1677ff', quantity: 0 }],
    },
  ],
};

export type AddNewProductFormValues = z.infer<
  ReturnType<typeof createAddNewProductSchema>
>;
