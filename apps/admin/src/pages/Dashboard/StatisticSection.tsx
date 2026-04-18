import { Card, Col, Row, Select, Tag } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { dashboardService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineCancel } from 'react-icons/md';
import { TFunction } from 'i18next';
import { useState } from 'react';

const ChangeTag = ({ percent }: { percent: number }) => {
  const up = percent >= 0;
  return (
    <Tag
      color={up ? 'green' : 'red'}
      icon={up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
    >
      {up ? '+' : ''}
      {percent}%
    </Tag>
  );
};

const formatMoney = (n: number) =>
  '$ ' +
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n / 26000);

interface Props {
  t: TFunction;
}

const StatisticSection = ({ t }: Props) => {
  const [range, setRange] = useState<string>('1d');

  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary', range],
    queryFn: () => dashboardService.getDashboardData({ range }),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end w-full">
        <Select
          className="w-48"
          options={[
            { label: t('today'), value: '1d' },
            { label: t('week'), value: 'week' },
            { label: t('month'), value: 'month' },
            { label: t('3Months'), value: '3m' },
            { label: t('6Months'), value: '6m' },
            { label: t('year'), value: 'year' },
          ]}
          value={range}
          onChange={(value) => setRange(value)}
        />
      </div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <div className="flex justify-between">
              <div>
                <p className="text-base">{t('revenue')}</p>
                <h2 className="text-xl font-semibold my-2">
                  {formatMoney(summaryQuery.data?.revenue.current || 0)}
                </h2>
                <ChangeTag percent={summaryQuery.data?.revenue.change || 0} />
              </div>
              <div className="bg-green-200 size-10 rounded-md flex items-center justify-center">
                <DollarOutlined className="text-green-500 text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <div className="flex justify-between">
              <div>
                <p className="text-base">{t('users')}</p>
                <h2 className="text-xl font-semibold my-2">
                  {summaryQuery.data?.users.current || 0}
                </h2>
                <ChangeTag percent={summaryQuery.data?.users.change || 0} />
              </div>
              <div className="bg-blue-200 size-10 rounded-md flex items-center justify-center">
                <UserOutlined className="text-blue-500 text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <div className="flex justify-between">
              <div>
                <p className="text-base">{t('orders')}</p>
                <h2 className="text-xl font-semibold my-2">
                  {summaryQuery.data?.orders.current || 0}
                </h2>
                <ChangeTag percent={summaryQuery.data?.orders.change || 0} />
              </div>
              <div className="bg-yellow-200 size-10 rounded-md flex items-center justify-center">
                <ShoppingCartOutlined className="text-yellow-500 text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <div className="flex justify-between">
              <div>
                <p className="text-base">{t('cancelledOrders')}</p>
                <h2 className="text-xl font-semibold my-2">
                  {summaryQuery.data?.cancelledOrders.current || 0}
                </h2>
                <ChangeTag
                  percent={summaryQuery.data?.cancelledOrders.change || 0}
                />
              </div>
              <div className="bg-red-200 size-10 rounded-md flex items-center justify-center">
                <MdOutlineCancel className="text-red-500 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticSection;
