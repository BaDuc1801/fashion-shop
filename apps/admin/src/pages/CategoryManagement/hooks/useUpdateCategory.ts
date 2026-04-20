import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { categoryService, resolveImageUrls } from '@shared';
import type { CategoryFormValues } from '../schemas/categoryFormSchema';

type UseUpdateCategoryParams = {
  categoryId?: string;
  currentCategoryId?: string;
};

export const useUpdateCategory = ({
  categoryId,
  currentCategoryId,
}: UseUpdateCategoryParams) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (!categoryId) {
        throw new Error('Missing category id');
      }

      const imageUrls = await resolveImageUrls(values.images);
      return categoryService.updateCategory(categoryId, {
        name: values.name,
        nameEn: values.nameEn,
        slug: values.slug,
        status: values.status ? 'active' : 'inactive',
        image: imageUrls[0],
      });
    },
    onSuccess: async () => {
      message.success(t('admin.category.form.updateSuccess'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
        queryClient.invalidateQueries({
          queryKey: [
            'categories',
            'detail-by-id',
            currentCategoryId ?? categoryId,
          ],
        }),
      ]);
    },
    onError: () => {
      message.error(t('admin.category.form.updateFailed'));
    },
  });
};
