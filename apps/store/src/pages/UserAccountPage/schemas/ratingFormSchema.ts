import { TFunction } from 'i18next';
import { z } from 'zod';

export const createRatingFormSchema = (t: TFunction) =>
  z.object({
    rating: z.number().min(1, t('ratingRequired')),
    comment: z.string().optional(),
    images: z.any().optional(),
  });

export type RatingFormValues = {
  rating: number;
  comment?: string;
  images?: string[];
};
