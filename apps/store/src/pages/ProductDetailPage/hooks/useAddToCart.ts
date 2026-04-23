import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@shared';
import { message } from 'antd';
import { t } from 'i18next';

export const useToggleCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      size,
      color,
      quantity,
    }: {
      productId: string;
      size: string;
      color: string;
      quantity: number;
    }) => {
      return userService.addToCart({ productId, size, color, quantity });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product'],
      });
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
      message.success(t('product.addToCartSuccess'));
    },
  });
};
