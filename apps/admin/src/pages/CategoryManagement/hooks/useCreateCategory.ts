import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { categoryService, resolveImageUrls } from '@shared';
import type { CategoryFormValues } from '../schemas/categoryFormSchema';

export const useCreateCategory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const imageUrls = await resolveImageUrls(values.images);
      return categoryService.createCategory({
        name: values.name,
        nameEn: values.nameEn,
        slug: values.slug,
        status: values.status ? 'active' : 'inactive',
        image: imageUrls[0],
      });
    },
    onSuccess: async (created) => {
      message.success(t('admin.category.form.createSuccess'));
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate(`/categories/${created._id}`);
    },
    onError: () => {
      message.error(t('admin.category.form.createFailed'));
    },
  });
};
