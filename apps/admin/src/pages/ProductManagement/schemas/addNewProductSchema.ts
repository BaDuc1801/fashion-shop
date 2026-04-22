import type { UploadFile } from 'antd';
import type { TFunction } from 'i18next';
import { z } from 'zod';

const productSkuSchema = (t: TFunction) =>
  z.object({
    size: z.string().min(1, t('admin.validation.requiredSize')),
    quantity: z.number().min(0, t('admin.validation.stockMin')),
  });

const productVariantSchema = (t: TFunction) =>
  z.object({
    color: z.string().min(1, t('admin.validation.requiredColorName')),
    images: z
      .array(z.custom<UploadFile>())
      .min(1, t('admin.validation.minOneImage')),
    skus: z.array(productSkuSchema(t)).min(1, t('admin.validation.minOneSize')),
  });

export const createAddNewProductSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('admin.validation.requiredProductName')),
    nameEn: z.string().min(1, t('admin.validation.requiredProductName')),
    description: z.string().min(1, t('admin.validation.requiredDescription')),
    descriptionEn: z.string().min(1, t('admin.validation.requiredDescription')),
    categoryId: z.string().min(1, t('admin.validation.requiredCategory')),
    sku: z.string().min(1, t('admin.validation.requiredSku')),
    price: z.number().min(0, t('admin.validation.priceMin')),
    status: z.boolean(),
    variants: z
      .array(productVariantSchema(t))
      .min(1, t('admin.validation.minOneColor')),
  });

export const addNewProductSchemaDefaultValues = {
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  categoryId: '',
  sku: '',
  price: 0,
  status: true,
  variants: [
    {
      color: '#fff',
      images: [],
      skus: [
        {
          size: '',
          quantity: 0,
        },
      ],
    },
  ],
};

export type AddNewProductFormValues = z.infer<
  ReturnType<typeof createAddNewProductSchema>
>;
