import { Input, Pagination, Select, Spin, Empty } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { categoryService, useDebouncedValue } from '@shared';
import { useGetProduct } from '../hooks/useGetProduct';

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

  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: categoryRes, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      categoryService.getCategories({ page: 1, limit: 100, status: 'active' }),
  });

  const categories = useMemo(() => categoryRes?.data || [], [categoryRes]);

  const category = useMemo(
    () => categories.find((c) => c._id === categoryId),
    [categories, categoryId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, debouncedSearch, sortBy]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [categoryId]);

  const { data, isLoading } = useGetProduct({
    categoryId,
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    // sortBy,
  });

  const hasData = data?.data && data.data.length > 0;

  return (
    <section className="py-8 mx-[200px]">
      <div className="flex items-start gap-6">
        {/* SIDEBAR */}
        <aside className="w-[280px] shrink-0 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t('filters.title')}</h2>
            <button
              onClick={() => {
                setSortBy('featured');
                setSearchText('');
                setCurrentPage(1);
                navigate('/category');
              }}
              className="text-xs text-slate-500"
            >
              {t('common.clearAll')}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {isCategoryLoading ? (
              <div className="flex justify-center py-4">
                <Spin />
              </div>
            ) : (
              categories.map((c) => {
                const checked = categoryId === c._id;
                return (
                  <button
                    key={c._id}
                    onClick={() => navigate(`/category/${c._id}`)}
                    className={`w-full flex justify-between px-3 py-2 rounded border ${
                      checked
                        ? 'border-pink-300 bg-pink-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-slate-500">
                      {c.productCount ?? 0}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {category?.name ?? t('filters.allProducts')}
              </h1>
              <p className="text-sm text-slate-500">
                {t('common.items', { count: data?.total || 0 })}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t('filters.searchProducts')}
                allowClear
                style={{ width: 280 }}
              />

              <Select
                value={sortBy}
                onChange={(v) => setSortBy(v)}
                options={[
                  { value: 'featured', label: t('filters.featured') },
                  { value: 'price-asc', label: t('filters.priceLowToHigh') },
                  { value: 'price-desc', label: t('filters.priceHighToLow') },
                ]}
                style={{ width: 220 }}
              />
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <Spin />
              </div>
            ) : hasData ? (
              data?.data?.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`}>
                  <div className="border rounded overflow-hidden">
                    <img
                      alt={p.name}
                      src={p.images?.[0]}
                      className="h-[170px] w-full object-cover"
                    />
                    <div className="p-2">
                      <div className="text-sm font-semibold truncate">
                        {p.name}
                      </div>
                      <div className="font-bold">
                        {p.price.toLocaleString()} ₫
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex justify-center py-20">
                <Empty />
              </div>
            )}
          </div>

          {/* PAGINATION */}
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={data?.total || 0}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
