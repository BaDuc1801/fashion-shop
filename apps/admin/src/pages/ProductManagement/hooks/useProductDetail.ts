import { useEffect } from 'react';
import type { UploadFile } from 'antd';
import type { ProductData } from '@shared';
import type { UseFormReset } from 'react-hook-form';
import type { AddNewProductFormValues } from '../schemas/addNewProductSchema';

const DEFAULT_SWATCH = '#1677ff';
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

type UseProductDetailArgs = {
  initialValues?: ProductData;
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
      categoryId: initialValues.categoryId._id,
      sku: initialValues.sku,
      price: initialValues.price,
      status: initialValues.status === 'active',
      images: initialValues.images?.length
        ? initialValues.images.map(
            (url, index) =>
              ({
                uid: `${initialValues._id}-img-${index}`,
                name: `${initialValues.name}-${index + 1}`,
                status: 'done',
                url,
              }) as UploadFile,
          )
        : [],
      sizeVariants:
        initialValues.sizeVariants && initialValues.sizeVariants.length > 0
          ? initialValues.sizeVariants.map((sv) => ({
              size: sv.size,
              colors: sv.colors.map((c) => ({
                name: HEX_COLOR_REGEX.test(c.name) ? c.name : DEFAULT_SWATCH,
                quantity: c.quantity,
              })),
            }))
          : [
              {
                size: '',
                colors: [
                  { name: DEFAULT_SWATCH, quantity: initialValues.stock },
                ],
              },
            ],
    });
  }, [initialValues, reset]);
};
