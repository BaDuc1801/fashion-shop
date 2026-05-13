import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionService, userService } from '@shared';
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

    onSuccess: async (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['product'],
      });
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });

      // Track interaction best-effort; don't block cart UI on tracking failures.
      void interactionService
        .trackAddToCart({ productId: variables.productId })
        .catch(() => undefined);
      message.success(t('product.addToCartSuccess'));
    },
  });
};
