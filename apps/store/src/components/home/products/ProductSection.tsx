import { Empty, Pagination, Spin, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetProduct } from '../../../hooks/useGetProduct';
import ProductCard from './ProductCard';

const PAGE_SIZE = 8;

const TABS = [
  { key: '1', label: 'Men' },
  { key: '2', label: 'Women' },
  { key: '3', label: 'Kids' },
];

const OutProductsSection = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('1');
  const [currentPage, setCurrentPage] = useState(1);

  const activeTab = useMemo(
    () => TABS.find((t) => t.key === activeKey) ?? TABS[0],
    [activeKey],
  );

  const { data, isLoading } = useGetProduct({
    categoryName: activeTab.label,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const hasData = data?.data && data?.data?.length > 0;

  return (
    <section className="mt-20 flex flex-col justify-center mx-[200px]">
      <h2 className="text-2xl font-bold w-full text-center">
        {t('home.outProducts')}
      </h2>
      <Tabs
        activeKey={activeKey}
        onChange={(k) => {
          setActiveKey(k);
          setCurrentPage(1);
        }}
        centered
        items={TABS.map((tab) => ({
          label: <span className="text-base font-semibold">{tab.label}</span>,
          key: tab.key,
          children: (
            <div className="w-full">
              <div
                className={`mt-6 grid gap-6 gap-y-8 w-full ${isLoading ? 'grid-cols-1' : hasData ? 'grid-cols-4' : 'grid-cols-1'}`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Spin />
                  </div>
                ) : hasData ? (
                  data?.data.map((p) => (
                    <Link
                      key={p._id}
                      to={`/products/${p.sku}`}
                      className="block"
                    >
                      <ProductCard product={p} />
                    </Link>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <Empty description="No products found" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <Pagination
                  current={tab.key === activeKey ? currentPage : 1}
                  pageSize={PAGE_SIZE}
                  total={data?.total}
                  onChange={(page) => {
                    setCurrentPage(page);
                  }}
                  showSizeChanger={false}
                />
              </div>
            </div>
          ),
        }))}
      />
    </section>
  );
};

export default OutProductsSection;
