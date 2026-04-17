import { OrderDetailData, orderService, useTableQuery } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Input, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { formatUsd } from '@shared';
import { useState } from 'react';
import OrderItemsExpanded from './OrderItemsExpanded';
import { useParams } from 'react-router-dom';

const UserOrderHistory = () => {
  const { t } = useTranslation();
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const { id } = useParams<{ id: string }>();
  const { page, limit, onPageChange, searchText, setSearchText, search } =
    useTableQuery({
      defaultLimit: 6,
    });
  const queryParams = {
    page,
    limit,
    search,
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', id, queryParams],
    queryFn: () => {
      if (!id) throw new Error('Missing user id');
      return orderService.getUserOrders(id, queryParams);
    },
    enabled: Boolean(id),
    retry: false,
  });

  const orderColumns: ColumnsType<OrderDetailData> = [
    {
      title: t('orderCode'),
      dataIndex: 'orderCode',
    },
    {
      title: t('orderDate'),
      dataIndex: 'createdAt',
      defaultSortOrder: 'descend',
      render: (text) => <span>{dayjs(text).format('DD/MM/YYYY, HH:mm')}</span>,
      sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
    },
    {
      title: t('paymentMethod'),
      dataIndex: 'paymentMethod',
    },
    {
      title: t('orderStatus'),
      dataIndex: 'orderStatus',
      render: (text) => {
        const color =
          text === 'completed' ? 'green' : text === 'pending' ? 'gold' : 'red';
        return <Tag color={color}>{t(`${text}`)}</Tag>;
      },
    },
    {
      title: t('orderTotal'),
      dataIndex: 'total',
      render: (text) => <span>{formatUsd(text)}</span>,
      sorter: (a, b) => a.total - b.total,
    },
  ];
  return (
    <div className="">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-xl font-semibold">{t('orderHistory')}</h1>
        <Input
          size="large"
          placeholder={t('search')}
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>
      <Table
        dataSource={orders?.orders ?? []}
        loading={isLoading}
        columns={orderColumns}
        rowKey="_id"
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys((prev) => {
              if (expanded) {
                return [...prev, record._id];
              }
              return prev.filter((id) => id !== record._id);
            });
          },
          expandedRowRender: (record) => (
            <OrderItemsExpanded
              items={record.items ?? []}
              t={t}
              discount={record.discount}
            />
          ),
        }}
        pagination={{
          pageSize: limit,
          current: page,
          total: orders?.total ?? 0,
          onChange: onPageChange,
        }}
      />
    </div>
  );
};

export default UserOrderHistory;
