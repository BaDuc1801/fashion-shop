import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@shared';

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
    },
  });
};
