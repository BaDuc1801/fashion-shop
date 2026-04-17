import { Input, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  formatUsd,
  OrderDetailData,
  orderService,
  useTableQuery,
} from '@shared';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

const OrderManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('');

  const { page, limit, search, searchText, setSearchText, onPageChange } =
    useTableQuery({
      defaultLimit: 10,
      defaultStatus: status,
    });
  const queryParams = {
    search,
    page,
    limit,
    orderStatus: status,
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => orderService.getAllOrders(queryParams),
  });

  const columns: ColumnsType<OrderDetailData> = useMemo(
    () => [
      {
        title: t('admin.order.col.orderId'),
        dataIndex: 'orderCode',
        key: 'id',
        width: 120,
      },
      {
        title: t('admin.order.col.customer'),
        key: 'userId.name',
        width: 120,
        render: (record: OrderDetailData) => record?.userId?.name || '-',
      },
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
        title: t('paymentMethod'),
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        width: 130,
        render: (paymentMethod: OrderDetailData['paymentMethod']) => {
          return <span>{paymentMethod}</span>;
        },
      },
      {
        title: t('admin.order.col.status'),
        dataIndex: 'orderStatus',
        key: 'status',
        width: 130,
        render: (status: OrderDetailData['orderStatus']) => {
          const color =
            status === 'completed'
              ? 'green'
              : status === 'shipping'
                ? 'blue'
                : status === 'pending'
                  ? 'gold'
                  : 'red';
          return (
            <Tag color={color}>
              {t(`admin.dashboard.orderStatus.${status}`)}
            </Tag>
          );
        },
      },
      {
        title: t('admin.order.col.placedAt'),
        dataIndex: 'placedAt',
        key: 'placedAt',
        width: 150,
        render: (d: OrderDetailData['createdAt']) =>
          dayjs(d).format('DD/MM/YYYY HH:mm'),
        sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{t('admin.order.title')}</span>
      </div>
      <div className="flex items-center justify-end gap-4">
        <Select
          allowClear
          placeholder={t('filterStatus')}
          className="w-44"
          size="large"
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: 'pending', label: t('pending') },
            { value: 'processing', label: t('processing') },
            { value: 'shipping', label: t('shipping') },
            { value: 'completed', label: t('completed') },
            { value: 'cancelled', label: t('cancelled') },
          ]}
        />
        <Input
          size="large"
          placeholder={t('admin.order.searchPlaceholder')}
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>
      <Table
        className="w-full"
        columns={columns}
        dataSource={orders?.orders ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: limit,
          current: page,
          total: orders?.total ?? 0,
          onChange: onPageChange,
        }}
        onRow={(record) => {
          return {
            onClick: () => navigate(`/orders/${record._id}`),
            className: 'cursor-pointer',
          };
        }}
      />
    </div>
  );
};

export default OrderManagementPage;
