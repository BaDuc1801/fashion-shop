import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { productService } from '@shared';

type UseDeleteProductParams = {
  productId?: string;
};

export const useDeleteProduct = ({ productId }: UseDeleteProductParams) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!productId) {
        throw new Error('Missing product id');
      }
      return productService.deleteProduct(productId);
    },
    onSuccess: async () => {
      message.success(t('admin.product.form.deleteSuccess'));
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products', { replace: true });
    },
    onError: () => {
      message.error(t('admin.product.form.deleteFailed'));
    },
  });
};
