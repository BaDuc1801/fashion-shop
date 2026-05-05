import { useTranslation } from 'react-i18next';
import StatisticSection from './StatisticSection';
import ChartSection from './ChartSection';
import OrderInfinityList from './OrderInfinityList';
import BestSellerInfinityList from './BestSellerInfinityList';
import { ADMIN_PANEL_ROLE, useAuthStore } from '@fashion-monorepo/shared';

const Dashboard = () => {
  const { t } = useTranslation();
  const isAdmin = useAuthStore((s) => s.user?.role === ADMIN_PANEL_ROLE);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-bold">{t('dashboard')}</p>
      <StatisticSection t={t} isAdmin={isAdmin} />
      <div className="grid grid-cols-2 w-full gap-4">
        <OrderInfinityList />
        <BestSellerInfinityList />
      </div>
      {isAdmin && <ChartSection t={t} />}
    </div>
  );
};

export default Dashboard;
