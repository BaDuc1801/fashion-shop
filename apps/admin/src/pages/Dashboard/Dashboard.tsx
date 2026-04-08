import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  dashboardSummary,
  recentOrders,
  salesLast7Days,
  topProducts,
  type RecentOrder,
  type TopProduct,
} from './dashboardMockData';

const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

const ChangeTag = ({ percent }: { percent: number }) => {
  const up = percent >= 0;
  return (
    <Tag
      color={up ? 'green' : 'red'}
      className="!m-0 !border-0 !px-2 !py-0.5"
      icon={up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
    >
      {up ? '+' : ''}
      {percent}%
    </Tag>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const maxSales = Math.max(...salesLast7Days.map((d) => d.value));

  const orderColumns: ColumnsType<RecentOrder> = useMemo(
    () => [
      { title: t('admin.dashboard.orderCol.order'), dataIndex: 'id', key: 'id', width: 110 },
      { title: t('admin.dashboard.orderCol.customer'), dataIndex: 'customer', key: 'customer' },
      {
        title: t('admin.dashboard.orderCol.amount'),
        dataIndex: 'amount',
        key: 'amount',
        width: 100,
        render: (v: number) => formatUsd(v),
      },
      {
        title: t('admin.dashboard.orderCol.status'),
        dataIndex: 'status',
        key: 'status',
        width: 110,
        render: (s: RecentOrder['status']) => {
          const color =
            s === 'completed' ? 'green' : s === 'pending' ? 'gold' : 'red';
          return (
            <Tag color={color}>
              {t(`admin.dashboard.orderStatus.${s}`)}
            </Tag>
          );
        },
      },
      {
        title: t('admin.dashboard.orderCol.time'),
        dataIndex: 'placedAt',
        key: 'placedAt',
        width: 140,
        render: (d) => d.format('DD/MM HH:mm'),
      },
    ],
    [t],
  );

  const topColumns: ColumnsType<TopProduct> = useMemo(
    () => [
      { title: t('admin.dashboard.topCol.product'), dataIndex: 'name', key: 'name' },
      { title: t('admin.dashboard.topCol.sold'), dataIndex: 'sold', key: 'sold', width: 80 },
      {
        title: t('admin.dashboard.topCol.revenue'),
        dataIndex: 'revenue',
        key: 'revenue',
        width: 100,
        render: (v: number) => formatUsd(v),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t('admin.dashboard.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{t('admin.dashboard.revenue')}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {formatUsd(dashboardSummary.totalRevenue)}
                </p>
                <div className="mt-2">
                  <ChangeTag percent={dashboardSummary.revenueChangePercent} />
                  <span className="ml-2 text-xs text-slate-400">
                    {t('admin.dashboard.vsLastMonth')}
                  </span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                <DollarOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{t('admin.dashboard.orders')}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {dashboardSummary.totalOrders.toLocaleString()}
                </p>
                <div className="mt-2">
                  <ChangeTag percent={dashboardSummary.ordersChangePercent} />
                  <span className="ml-2 text-xs text-slate-400">
                    {t('admin.dashboard.vsLastMonth')}
                  </span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                <ShoppingCartOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{t('admin.dashboard.customers')}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {dashboardSummary.totalUsers.toLocaleString()}
                </p>
                <div className="mt-2">
                  <ChangeTag percent={dashboardSummary.usersChangePercent} />
                  <span className="ml-2 text-xs text-slate-400">
                    {t('admin.dashboard.vsLastMonth')}
                  </span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                <UserOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{t('admin.dashboard.productsKpi')}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {dashboardSummary.totalProducts}
                </p>
                <div className="mt-2">
                  <ChangeTag percent={dashboardSummary.productsChangePercent} />
                  <span className="ml-2 text-xs text-slate-400">
                    {t('admin.dashboard.vsLastMonth')}
                  </span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ShoppingOutlined className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={t('admin.dashboard.recentOrders')} className="rounded-xl border-slate-200 shadow-sm">
            <Table<RecentOrder>
              size="small"
              rowKey="id"
              columns={orderColumns}
              dataSource={recentOrders}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title={t('admin.dashboard.topProducts')} className="rounded-xl border-slate-200 shadow-sm">
            <Table<TopProduct>
              size="small"
              rowKey="id"
              columns={topColumns}
              dataSource={topProducts}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('admin.dashboard.sales7Days')} className="rounded-xl border-slate-200 shadow-sm">
        <div className="flex h-40 items-end justify-between gap-2 px-2">
          {salesLast7Days.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-rose-200 to-rose-400 transition-all"
                style={{
                  height: `${Math.max(12, (d.value / maxSales) * 120)}px`,
                }}
                title={formatUsd(d.value)}
              />
              <span className="text-xs text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
