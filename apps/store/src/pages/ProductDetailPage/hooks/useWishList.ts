import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  interactionService,
  userService,
  type InteractionSource,
} from '@shared';

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      inWishlist,
    }: {
      productId: string;
      inWishlist: boolean;
      source?: InteractionSource;
    }) => {
      if (inWishlist) {
        return userService.removeFromWishlist(productId);
      }
      return userService.addToWishlist(productId);
    },

    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['product'],
      });
      queryClient.invalidateQueries({
        queryKey: ['wishlist'],
      });

      if (!variables.inWishlist) {
        void interactionService
          .trackClick({
            productId: variables.productId,
            source: variables.source ?? 'organic',
          })
          .catch(() => undefined);
      }
    },
  });
};
