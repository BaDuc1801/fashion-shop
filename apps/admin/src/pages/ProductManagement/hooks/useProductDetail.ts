import { useEffect } from 'react';
import type { Product } from '@shared';
import type { UseFormReset } from 'react-hook-form';
import type { AddNewProductFormValues } from '../schemas/addNewProductSchema';
import { UploadFile } from 'antd';

type UseProductDetailArgs = {
  initialValues?: Product;
  reset: UseFormReset<AddNewProductFormValues>;
};

export const useProductDetail = ({
  initialValues,
  reset,
}: UseProductDetailArgs) => {
  useEffect(() => {
    if (!initialValues) return;

    reset({
      name: initialValues.name,
      nameEn: initialValues.nameEn,
      descriptionEn: initialValues.descriptionEn,
      categoryId: initialValues?.categoryId?._id,
      sku: initialValues.sku,
      description: initialValues.description,
      price: initialValues.price,
      status: initialValues.status === 'active',
      variants: initialValues.variants.map((v) => ({
        color: v.color,
        images: v.images.map((url, index) => ({
          uid: `${v.color}-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        })) as UploadFile[],
        skus: v.skus.map((sku) => ({
          size: sku.size,
          quantity: sku.quantity,
        })),
      })),
    });
  }, [initialValues, reset]);
};
