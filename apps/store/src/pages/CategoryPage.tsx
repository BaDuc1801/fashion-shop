import { Input, Pagination, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getMockProductsByCategory,
  type CategoryProduct,
} from '../components/home/category/categoryProductsData';
import { categoryData } from '../components/home/category/categoryData';

const PAGE_SIZE = 8;

const CategoryPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>(
    'featured',
  );
  const [searchText, setSearchText] = useState('');

  const category = useMemo(
    () =>
      categoryId ? categoryData.find((c) => c.id === categoryId) : undefined,
    [categoryId],
  );

  // Nếu đổi category thì quay về trang 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [categoryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const products: CategoryProduct[] = useMemo(() => {
    if (category) return getMockProductsByCategory(category);
    return categoryData.flatMap((c) => getMockProductsByCategory(c));
  }, [category]);

  const searchedProducts = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, searchText]);

  const sortedProducts = useMemo(() => {
    if (sortBy === 'featured') return searchedProducts;

    const next = [...searchedProducts];
    next.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      return b.price - a.price;
    });
    return next;
  }, [searchedProducts, sortBy]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, currentPage]);

  const pageTotal = sortedProducts.length;

  return (
    <section className="py-8 mx-[200px]">
      <div className="flex items-start gap-6">
        {/* Sidebar Filters */}
        <aside className="w-[280px] shrink-0 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              {t('filters.title')}
            </h2>
            <button
              type="button"
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
              onClick={() => {
                setSortBy('featured');
                setCurrentPage(1);
                setSearchText('');
                navigate('/category');
              }}
            >
              {t('common.clearAll')}
            </button>
          </div>

          <div className="mt-3">
            <div className="text-xs font-semibold text-slate-900 uppercase">
              {t('filters.category')}
            </div>
            <div className="mt-2 space-y-2">
              {categoryData.map((c) => {
                const checked = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/category/${c.id}`)}
                    className={[
                      'w-full flex items-center justify-between rounded-md border px-3 py-2 text-left transition-colors',
                      checked
                        ? 'border-pink-300 bg-pink-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {c.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {c.itemCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-slate-900 uppercase">
              {t('filters.price')}
            </div>
            <div className="mt-2 space-y-2">
              {['Rs 1,000-2,000', 'Rs 2,000-5,000', 'Rs 5,000+'].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600"
                >
                  <span>{t}</span>
                  <span>({Math.floor((t.length * 13) % 200)})</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {category?.name ?? t('filters.allProducts')}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {t('common.items', { count: sortedProducts.length })}
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t('filters.searchProducts')}
                allowClear
                style={{ width: 280 }}
              />
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">
                  {t('filters.sortBy')}
                </span>
                <Select
                  value={sortBy}
                  onChange={(v) => {
                    setSortBy(v);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'featured', label: t('filters.featured') },
                    { value: 'price-asc', label: t('filters.priceLowToHigh') },
                    { value: 'price-desc', label: t('filters.priceHighToLow') },
                  ]}
                  style={{ width: 220 }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="block">
                <article className="rounded-sm overflow-hidden border border-slate-200 bg-white">
                  <div className="relative">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-[170px] w-full object-cover object-top"
                    />
                    {p.isHot ? (
                      <span className="absolute top-2 left-2 rounded-full bg-[#ffb3c6] px-3 py-1 text-[11px] font-semibold text-black">
                        HOT
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 px-3 pb-3">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {p.name}
                    </h3>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {p.price.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={pageTotal}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
