import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@shared';

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      inWishlist,
    }: {
      productId: string;
      inWishlist: boolean;
    }) => {
      if (inWishlist) {
        return userService.removeFromWishlist(productId);
      }
      return userService.addToWishlist(productId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product'],
      });
      queryClient.invalidateQueries({
        queryKey: ['wishlist'],
      });
    },
  });
};
