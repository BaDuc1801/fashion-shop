import { ChartData, dashboardService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import dayjs from 'dayjs';
import { TFunction } from 'i18next';
import { useMemo } from 'react';

interface Props {
  t: TFunction;
}

const ChartSection = ({ t }: Props) => {
  const chartQuery = useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: () =>
      dashboardService.getChartData({
        type: 'week',
        from: dayjs().subtract(6, 'day').startOf('day').toISOString(),
        to: dayjs().endOf('day').toISOString(),
      }),
  });

  const chart: ChartData['data'] = useMemo(
    () => chartQuery.data?.data || [],
    [chartQuery.data?.data],
  );

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = dayjs().subtract(6 - i, 'day');
      return {
        key: date.format('YYYY-MM-DD'),
        label: date.format('DD'),
      };
    });

    const map = new Map<string, number>();

    chart.forEach((item) => {
      map.set(item._id, item.revenue);
    });

    return last7Days.map((d) => ({
      date: d.key,
      label: d.label,
      revenue: map.get(d.key) || 0,
    }));
  }, [chart]);

  const maxSales = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <Card title={t('salesChart')}>
      <div className="flex items-end gap-2 h-[160px]">
        {chartData.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center">
            <div
              className="w-[50px] bg-blue-400 rounded-t"
              style={{
                height: `${Math.max(4, (d.revenue / maxSales) * 140)}px`,
              }}
            />
            <span className="text-xs">{d.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChartSection;
