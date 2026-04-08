import { Input, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Order, orders } from './ordersMockData';

const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);

const OrderManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredData = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<Order> = useMemo(
    () => [
      { title: t('admin.order.col.orderId'), dataIndex: 'id', key: 'id', width: 120 },
      { title: t('admin.order.col.customer'), dataIndex: 'customerName', key: 'customer' },
      {
        title: t('admin.order.col.total'),
        dataIndex: 'total',
        key: 'total',
        width: 120,
        render: (v: number) => formatUsd(v),
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: t('admin.order.col.items'),
        key: 'itemCount',
        width: 90,
        align: 'center',
        render: (_, record) => record.items.length,
      },
      {
        title: t('admin.order.col.status'),
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (status: Order['status']) => {
          const color =
            status === 'completed'
              ? 'green'
              : status === 'shipping'
                ? 'blue'
                : status === 'pending'
                  ? 'gold'
                  : 'red';
          return (
            <Tag color={color}>{t(`admin.dashboard.orderStatus.${status}`)}</Tag>
          );
        },
      },
      {
        title: t('admin.order.col.placedAt'),
        dataIndex: 'placedAt',
        key: 'placedAt',
        width: 150,
        render: (d: Order['placedAt']) => d.format('DD/MM/YYYY HH:mm'),
        sorter: (a, b) => a.placedAt.valueOf() - b.placedAt.valueOf(),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{t('admin.order.title')}</span>
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.order.searchPlaceholder')}
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        className="w-full"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
        onRow={(record) => ({
          onClick: () => navigate(`/orders/${encodeURIComponent(record.id)}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default OrderManagementPage;
