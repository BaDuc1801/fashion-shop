import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message, UploadFile } from 'antd';
import { CreateRatingRequest, ratingService, resolveImageUrls } from '@shared';
import { useTranslation } from 'react-i18next';

export const useCreateReview = (onClose: () => void, reset: () => void) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (payload: CreateRatingRequest) => {
      const imageUrls = await resolveImageUrls(
        payload.images as unknown as UploadFile[],
      );

      return ratingService.createRating({
        ...payload,
        images: imageUrls,
      });
    },

    onSuccess: async () => {
      message.success(t('reviewSubmitted'));
      reset();
      onClose();

      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },

    onError: () => {
      message.error(t('submitFailed'));
    },
  });
};
