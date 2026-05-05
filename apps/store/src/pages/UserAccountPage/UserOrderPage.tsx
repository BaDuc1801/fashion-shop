import { OrderDetailData, orderService, useTableQuery } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, message, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { formatUsd } from '@shared';
import OrderItemsExpanded from './OrderItemsExpanded';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const UserOrderPage = () => {
  const { t, i18n } = useTranslation();
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const [params, setSearchParams] = useSearchParams();
  const urlOrderCode = params.get('orderCode') || '';

  const clearedRef = useRef(false);

  const { page, limit, onPageChange, searchText, setSearchText, search } =
    useTableQuery({
      defaultLimit: 6,
    });

  useEffect(() => {
    if (urlOrderCode && urlOrderCode !== searchText) {
      setSearchText(urlOrderCode);
    }
  }, [urlOrderCode, searchText, setSearchText]);

  const queryParams = {
    page,
    limit,
    search,
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => orderService.getMyOrders(queryParams),
    refetchInterval: 5000,
  });

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId as string);
      message.success(t('cancelOrderSuccess'));
    } catch (error) {
      console.error(error);
      message.error(t('cancelOrderFailed'));
    }
  };

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
          text === 'paid'
            ? 'lime'
            : text === 'completed'
              ? 'green'
              : text === 'pending'
                ? 'gold'
                : text === 'shipping'
                  ? 'blue'
                  : 'red';

        return (
          <Tag color={color} variant="outlined">
            {t(`${text}`)}
          </Tag>
        );
      },
    },
    {
      title: t('orderTotal'),
      dataIndex: 'total',
      render: (text) => <span>{formatUsd(text)}</span>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: t('action'),
      dataIndex: 'action',
      render: (_, record) =>
        record.orderStatus === 'pending' &&
        record.paymentMethod === 'cod' && (
          <Button
            type="text"
            size="small"
            danger
            onClick={() => handleCancelOrder(record._id)}
          >
            {t('cancelOrder')}
          </Button>
        ),
    },
  ];

  useEffect(() => {
    if (!orders?.orders?.length) return;

    const expanded = orders.orders
      .filter((order) => {
        const isCompleted = order.orderStatus === 'completed';

        const hasUnreviewedItem = order.items?.some(
          (item) => item.reviewed === false,
        );

        return isCompleted && hasUnreviewedItem;
      })
      .map((order) => order._id);

    setExpandedRowKeys(expanded);
  }, [orders]);

  return (
    <div className="px-[200px] py-[40px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-2">{t('myOrders')}</h1>

        <Input
          size="large"
          placeholder={t('search')}
          className="w-96"
          onFocus={(e) => {
            if (!clearedRef.current && params.toString()) {
              clearedRef.current = true;
              setSearchParams({});
            }
            e.target.select();
          }}
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
              if (expanded) return [...prev, record._id];
              return prev.filter((id) => id !== record._id);
            });
          },
          expandedRowRender: (record) => (
            <OrderItemsExpanded
              items={record.items ?? []}
              t={t}
              language={i18n.language}
              discount={record.discount}
              orderId={record._id}
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

export default UserOrderPage;
