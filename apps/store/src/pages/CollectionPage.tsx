import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockCollections } from '../components/hero/mockCollections';
import { mockCategoryProducts } from '../components/home/category/categoryProductsData';

const CollectionPage = () => {
  const { t } = useTranslation();
  const { collectionId } = useParams<{ collectionId: string }>();

  const collection = useMemo(
    () => mockCollections.find((c) => c.id === collectionId),
    [collectionId],
  );

  const products = useMemo(() => {
    if (!collection) return [];
    return mockCategoryProducts.filter((p) =>
      collection.categoryIds.some((cat) => p.id.startsWith(`${cat}-`)),
    );
  }, [collection]);

  if (!collection) {
    return (
      <section className="py-10 mx-[200px]">
        <h1 className="text-2xl font-bold text-slate-900">
          {t('collection.notFound')}
        </h1>
        <Link className="mt-4 inline-block text-sm font-medium underline" to="/">
          {t('common.backToHome')}
        </Link>
      </section>
    );
  }

  return (
    <section className="py-10 mx-[200px]">
      <div className="max-w-3xl">
        <div className="text-sm font-semibold tracking-wide uppercase text-slate-600">
          {collection.subtitle}
        </div>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          {collection.title}
        </h1>
        <p className="mt-3 text-base text-slate-600">{collection.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="rounded-sm overflow-hidden border border-slate-200 bg-white hover:bg-slate-50"
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              className="h-[220px] w-full object-cover object-top"
            />
            <div className="px-3 pb-3 pt-2">
              <div className="truncate text-sm font-semibold text-slate-900">
                {p.name}
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                ${p.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionPage;

