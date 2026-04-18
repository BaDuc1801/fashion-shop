import { useTranslation } from 'react-i18next';
import StatisticSection from './StatisticSection';
import ChartSection from './ChartSection';
import OrderInfinityList from './OrderInfinityList';
import BestSellerInfinityList from './BestSellerInfinityList';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-bold">{t('dashboard')}</p>
      <StatisticSection t={t} />
      <div className="grid grid-cols-2 w-full gap-4">
        <OrderInfinityList />
        <BestSellerInfinityList />
      </div>
      <ChartSection t={t} />
    </div>
  );
};

export default Dashboard;
