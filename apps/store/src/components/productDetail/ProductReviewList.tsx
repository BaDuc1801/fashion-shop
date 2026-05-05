import { Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import { RatingResponse, RatingStatsResponse } from '@shared';

interface ProductReviewListProps {
  reviews: RatingResponse[];
  ratingStats: RatingStatsResponse;
}

const ProductReviewList = ({
  reviews,
  ratingStats,
}: ProductReviewListProps) => {
  const { t } = useTranslation();

  return (
    <section className="mt-12 rounded-sm bg-white">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {t('productReviews.title')}
          </h2>
          <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-600">
            <FaStar className="text-[#FADB14]" />
            <div>
              {t('productReviews.basedOn', {
                rating: ratingStats.avgRating.toFixed(2),
                count: reviews.length,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <article
            key={review._id}
            className="rounded-sm border border-slate-100 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={review.userId.avatar}
                  alt={review.userId.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <h3 className="font-medium text-slate-900">
                  {review.userId.name}
                </h3>
              </div>

              <time className="text-xs text-slate-500">
                {new Date(review.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>

            <Rate disabled value={review.rating} className="mt-2 text-sm" />
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {review.maskedComment || review.comment}
            </p>
            {review.images?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.images.map((imageUrl) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt={`${review.userId.name} review`}
                    className="h-20 w-20 rounded-sm object-cover shadow-lg"
                  />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductReviewList;
