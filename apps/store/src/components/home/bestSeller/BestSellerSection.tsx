import { Pagination, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bestSellerTabs } from './bestSellerData';
import BestSellerCard from './BestSellerCard';

const PAGE_SIZE = 8;

const BestSellerSection = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState('1');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = bestSellerTabs;

  const activeTab = useMemo(
    () => tabs.find((t) => t.key === activeKey) ?? tabs[0],
    [activeKey, tabs],
  );

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return activeTab.products.slice(start, end);
  }, [activeTab.products, currentPage]);

  const pageTotal = activeTab.products.length;

  return (
    <section className="mt-20 flex flex-col justify-center mx-[200px]">
      <h2 className="text-2xl font-bold w-full text-center">
        {t('home.bestSellers')}
      </h2>
      <Tabs
        activeKey={activeKey}
        onChange={(k) => {
          setActiveKey(k);
          setCurrentPage(1);
        }}
        centered
        items={tabs.map((tab) => ({
          label: <span className="text-base font-semibold">{tab.label}</span>,
          key: tab.key,
          children: (
            <div className="w-full">
              <div className="mt-6 grid grid-cols-4 gap-6 gap-y-8">
                {(tab.key === activeKey
                  ? pageItems
                  : tab.products.slice(0, PAGE_SIZE)
                ).map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="block">
                    <BestSellerCard product={p} />
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Pagination
                  current={tab.key === activeKey ? currentPage : 1}
                  pageSize={PAGE_SIZE}
                  total={
                    tab.key === activeKey ? pageTotal : tab.products.length
                  }
                  onChange={(page) => {
                    if (tab.key !== activeKey) return;
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

export default BestSellerSection;
