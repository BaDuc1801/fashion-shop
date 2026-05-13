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

const RecommendedProductsCarousel = () => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data, isFetching } = useQuery({
    queryKey: ['product-detail-recommendations', user?.userId],
    queryFn: () => {
      if (!user) return recommendationService.getTrending(LIMIT);
      return recommendationService.getRecommendations(user.userId, LIMIT);
    },
  });

  const source: InteractionSource =
    data?.type === 'trending' ? 'trending' : 'recommendation';

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
    <section className="my-10">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {t('maybeYouLike')}
        </h2>
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
                <div className="text-sm font-semibold text-slate-900 line-clamp-2">
                  {name}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  ${p.price}
                </div>
                {!!p.explanation?.reason && (
                  <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {p.explanation.reason}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendedProductsCarousel;
