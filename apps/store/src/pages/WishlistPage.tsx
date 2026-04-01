import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockWishlist } from '../components/navbar/mockWishlist';

const WishlistPage = () => {
  const { t } = useTranslation();
  return (
    <section className="py-8 mx-[200px]">
      <h1 className="text-2xl font-bold text-slate-900">{t('nav.wishlist')}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {t('common.items', { count: mockWishlist.length })}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mockWishlist.map((it) => (
          <Link
            key={it.id}
            to={`/product/${it.id}`}
            className="rounded-sm overflow-hidden border border-slate-200 bg-white hover:bg-slate-50"
          >
            <div className="relative">
              <img
                src={it.imageUrl}
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
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;

