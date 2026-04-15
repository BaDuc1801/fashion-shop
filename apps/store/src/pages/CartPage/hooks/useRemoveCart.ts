import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@shared';

export const useRemoveCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.removeFromCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
    },
  });
};
