import { Input, Pagination, Select, Spin, Empty, Dropdown, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { categoryService, useTableQuery } from '@shared';
import { useGetProduct } from '../hooks/useGetProduct';

const PAGE_SIZE = 12;

const CategoryPage = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);

  const {
    page,
    limit,
    search,
    searchText,
    setSearchText,
    onPageChange,
    sortPrice,
    sortPriceState,
    onSortPriceChange,
  } = useTableQuery({
    defaultLimit: PAGE_SIZE,
  });

  const { data: categoryRes, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      categoryService.getCategories({ page: 1, limit: 100, status: 'active' }),
  });

  const categories = useMemo(() => categoryRes?.data || [], [categoryRes]);

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const { data, isLoading } = useGetProduct({
    categorySlug: slug,
    page,
    limit,
    search,
    sortPrice,
    lang: i18n.language,
  });

  const hasData = data?.data && data.data.length > 0;
  const categoryFilterContent = (
    <div className="w-[280px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t('filters.title')}</h2>
        <button
          onClick={() => {
            setSearchText('');
            onPageChange(1);
            navigate('/category');
            setOpenFilterDropdown(false);
          }}
          className="text-xs text-slate-500"
        >
          {t('common.clearAll')}
        </button>
      </div>

      <div className="mt-4 space-y-2 max-h-[320px] overflow-y-auto">
        {isCategoryLoading ? (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        ) : (
          categories.map((c) => {
            const checked = slug === c.slug;
            return (
              <button
                key={c._id}
                onClick={() => {
                  navigate(`/category/${c.slug}`);
                  setOpenFilterDropdown(false);
                }}
                className={`w-full flex justify-between px-3 py-2 rounded border ${
                  checked
                    ? 'border-pink-300 bg-pink-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{i18n.language === 'vi' ? c.name : c.nameEn}</span>
                <span className="text-xs text-slate-500">
                  {c.productCount ?? 0}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <section className="py-8 mx-4 md:mx-12 xl:mx-[120px] 2xl:mx-[200px]">
      <div className="flex items-start gap-6">
        {/* SIDEBAR */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          {categoryFilterContent}
        </aside>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {i18n.language === 'vi'
                  ? category?.name
                  : (category?.nameEn ?? t('filters.allProducts'))}
              </h1>
              <p className="text-sm text-slate-500">
                {t('common.items', { count: data?.total || 0 })}
              </p>
            </div>

            <div className="flex flex-col gap-3 items-stretch sm:items-end">
              <div className="lg:hidden">
                <Dropdown
                  trigger={['click']}
                  open={openFilterDropdown}
                  onOpenChange={setOpenFilterDropdown}
                  placement="bottomLeft"
                  dropdownRender={() => categoryFilterContent}
                >
                  <Button icon={<FilterOutlined />}>
                    {t('filters.title')}
                  </Button>
                </Dropdown>
              </div>
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t('filters.searchProducts')}
                allowClear
                className="w-full sm:w-[280px]"
              />

              <Select
                value={sortPriceState}
                onChange={(v) => onSortPriceChange(v)}
                options={[
                  { value: 'asc', label: t('filters.priceLowToHigh') },
                  { value: 'desc', label: t('filters.priceHighToLow') },
                ]}
                className="w-full sm:w-[220px]"
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
                <Link
                  key={p._id}
                  to={`/products/${p.sku}`}
                  className="group block "
                >
                  <div className="border rounded">
                    <div className="overflow-hidden">
                      <img
                        alt={p.name}
                        src={p.variants[0].images[0]}
                        className="h-[300px] w-full object-cover object-top transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-2 overflow-hidden">
                      <div className="text-sm font-semibold truncate text-slate-900 group-hover:text-slate-900">
                        {' '}
                        {i18n.language === 'vi' ? p.name : p.nameEn}
                      </div>
                      <div className="text-sm font-bold truncate text-slate-900 group-hover:text-slate-900">
                        ${p.price.toLocaleString()}
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
              current={page}
              pageSize={limit}
              total={data?.total || 0}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
