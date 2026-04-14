import { useEffect } from 'react';
import type { UploadFile } from 'antd';
import type { Category } from '@shared';
import type { UseFormReset } from 'react-hook-form';
import type { CategoryFormValues } from '../schemas/categoryFormSchema';

type UseCategoryDetailArgs = {
  initialValues?: Category;
  reset: UseFormReset<CategoryFormValues>;
};

export const useCategoryDetail = ({
  initialValues,
  reset,
}: UseCategoryDetailArgs) => {
  useEffect(() => {
    if (!initialValues) return;

    reset({
      name: initialValues.name,
      slug: initialValues.slug,
      status: initialValues.status === 'active',
      images: initialValues.image
        ? [
            {
              uid: initialValues._id,
              name: initialValues.name,
              status: 'done',
              url: initialValues.image,
            } as UploadFile,
          ]
        : [],
      productCount: initialValues.productCount,
    });
  }, [initialValues, reset]);
};
