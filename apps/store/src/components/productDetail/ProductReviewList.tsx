import { useEffect, useMemo, useState } from 'react';
import { Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import { getMockReviewsByProductId } from './mockReviewsData';

type ProductReviewListProps = {
  productId: string;
};

const formatDate = (dateInput: string) => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return dateInput;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ProductReviewList = ({ productId }: ProductReviewListProps) => {
  const { t } = useTranslation();
  const reviews = getMockReviewsByProductId(productId);
  const avgRating =
    reviews.reduce((total, r) => total + r.rating, 0) / reviews.length;
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [productId]);

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reviews.slice(start, start + pageSize);
  }, [currentPage, reviews]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

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
                rating: avgRating.toFixed(1),
                count: reviews.length,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {pagedReviews.map((review) => (
          <article
            key={review.id}
            className="rounded-sm border border-slate-100 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatarUrl}
                  alt={review.userName}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <h3 className="font-medium text-slate-900">
                  {review.userName}
                </h3>
              </div>

              <time className="text-xs text-slate-500">
                {formatDate(review.createdAt)}
              </time>
            </div>

            <Rate disabled value={review.rating} className="mt-2 text-sm" />
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {review.comment}
            </p>
            {review.images?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.images.map((imageUrl) => (
                  <img
                    key={imageUrl}
                    src={imageUrl}
                    alt={`${review.userName} review`}
                    className="h-20 w-20 rounded-sm object-cover"
                  />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('productReviews.previous')}
        </button>

        <div className="flex items-center gap-2">
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={[
                'h-8 w-8 rounded-sm border text-sm',
                page === currentPage
                  ? 'border-pink-300 bg-pink-50 text-pink-700'
                  : 'border-slate-200 text-slate-700 hover:border-slate-400',
              ].join(' ')}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="rounded-sm border border-slate-200 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('productReviews.next')}
        </button>
      </div>
    </section>
  );
};

export default ProductReviewList;
