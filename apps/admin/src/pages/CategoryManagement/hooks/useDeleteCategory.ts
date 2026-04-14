import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApiErrorResponse, categoryService } from '@shared';
import { AxiosError } from 'axios';

type UseDeleteCategoryParams = {
  categoryId?: string;
};

export const useDeleteCategory = ({ categoryId }: UseDeleteCategoryParams) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!categoryId) {
        throw new Error('Missing category id');
      }
      return categoryService.deleteCategory(categoryId);
    },
    onSuccess: async () => {
      message.success(t('admin.category.form.deleteSuccess'));
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/categories', { replace: true });
    },
    onError: (error: AxiosError) => {
      message.error((error.response?.data as ApiErrorResponse).message);
    },
  });
};
