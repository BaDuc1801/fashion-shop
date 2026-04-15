import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userService } from '@shared';
import { useQuery } from '@tanstack/react-query';

const WishlistPage = () => {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => {
      console.log('CALL API WISHLIST'); // 🔥 debug
      return userService.getWishlist();
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  console.log('wishlist data:', data);
  console.log('wishlist error:', error);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading wishlist</div>;
  }

  return (
    <section className="py-8 mx-[200px]">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.wishlist')}</h1>

      <p className="mt-1 text-sm text-slate-500">
        {t('common.items', { count: data?.length || 0 })}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data?.length && data.length > 0 ? (
          data.map((it) => (
            <Link
              key={it._id}
              to={`/product/${it.sku}`}
              className="rounded-sm overflow-hidden border border-slate-200 bg-white hover:bg-slate-50"
            >
              <div className="relative">
                <img
                  src={it.images?.[0] || ''}
                  alt={it.name}
                  className="h-[220px] w-full object-cover"
                />
              </div>

              <div className="px-3 pb-3 pt-2">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {it.name}
                </div>

                <div className="mt-1 text-sm font-bold text-slate-900">
                  ${it.price}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500">
            No items in wishlist
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;
