import {
  interactionService,
  recommendationService,
  useAuthStore,
  type InteractionSource,
} from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LIMIT = 12;

interface RecommendedProductsCarouselProps {
  onlyTrending?: boolean;
}

const RecommendedProductsCarousel = (
  props: RecommendedProductsCarouselProps,
) => {
  const { onlyTrending = false } = props;
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data, isFetching } = useQuery({
    queryKey: onlyTrending
      ? ['product-trending-only']
      : ['product-detail-recommendations', user?.userId],
    queryFn: () => {
      if (onlyTrending || !user)
        return recommendationService.getTrending(LIMIT);

      return recommendationService.getRecommendations(user.userId, LIMIT);
    },
  });

  const source: InteractionSource =
    onlyTrending || data?.type === 'trending' ? 'trending' : 'recommendation';

  const products = useMemo(() => data?.products ?? [], [data?.products]);

  if (isFetching) {
    return (
      <div className="mt-10 flex justify-center">
        <Spin />
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section
      className={` ${onlyTrending ? 'px-8 lg:px-12 xl:px-20 2xl:px-32 mt-20' : 'my-10'}`}
    >
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-900">
          {onlyTrending ? (
            <span className="text-2xl font-bold">{t('trendingNow')}</span>
          ) : (
            t('maybeYouLike')
          )}
        </h2>
        {!onlyTrending && data?.type !== 'trending' && (
          <p className="mt-1 text-sm text-slate-500">
            {t('recommendationBasedOn')}
          </p>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
        {products.map((p) => {
          const name = i18n.language === 'en' ? (p.nameEn ?? p.name) : p.name;
          const image = p.variants?.[0]?.images?.[0] ?? p.images?.[0] ?? '';

          return (
            <Link
              key={p._id}
              to={`/products/${p.sku}`}
              state={{ source }}
              className="snap-start shrink-0 w-[220px] rounded-md overflow-hidden border border-slate-200 bg-white hover:shadow-md transition-shadow"
              onClick={() => {
                if (!user) return;
                void interactionService.trackClick({
                  productId: p._id,
                  source,
                });
              }}
            >
              <div className="h-[220px] bg-slate-50">
                {!!image && (
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover object-top"
                  />
                )}
              </div>
              <div className="p-2">
                <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                  {name}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  ${p.price}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendedProductsCarousel;
