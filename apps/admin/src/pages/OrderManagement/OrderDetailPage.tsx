import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  message,
  Select,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { orderService, formatUsd } from '@shared';
import dayjs from 'dayjs';

type OrderItem = {
  productId: string;
  nameSnapshot: string;
  imageSnapshot: string;
  skuSnapshot: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<string>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id as string),
    enabled: !!id,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async (orderStatus: string) => {
      return orderService.updateOrderStatus(id as string, orderStatus);
    },
    onSuccess: () => {
      message.success(t('orderStatusUpdated'));
    },
    onError: () => {
      message.error(t('orderStatusUpdateFailed'));
    },
  });

  const handleUpdateStatus = async () => {
    await updateOrderStatusMutation.mutateAsync(status as string);
  };

  useEffect(() => {
    if (order?.orderStatus) {
      setStatus(order.orderStatus);
    }
  }, [order]);

  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: t('product'),
      key: 'product',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={48}
            src={row.imageSnapshot}
            className="bg-slate-100"
          >
            {row.nameSnapshot?.charAt(0)}
          </Avatar>

          <div>
            <div className="font-medium">{row.nameSnapshot}</div>
            <div className="text-xs text-slate-500">{row.skuSnapshot}</div>
            <div className="text-xs text-slate-400">
              {row.size} / {row.color}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      width: 80,
      align: 'center',
    },
    {
      title: t('price'),
      dataIndex: 'price',
      width: 120,
      render: (v: number) => formatUsd(v),
    },
    {
      title: t('subtotal'),
      width: 120,
      align: 'right',
      render: (_, row) => formatUsd(row.price * row.quantity),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  if (!order) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-slate-600">Order not found</p>
        <Button type="link" onClick={() => navigate('/orders')}>
          {t('back')}
        </Button>
      </div>
    );
  }

  const statusColor =
    status === 'completed'
      ? 'green'
      : status === 'shipping'
        ? 'blue'
        : status === 'pending'
          ? 'gold'
          : 'red';

  const isCodPayment = order.paymentMethod === 'cod';

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/orders')}
        className="mb-4"
      >
        Back
      </Button>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col gap-6">
          <Card title={t('summaryTitle')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('orderCode')}>
                {order.orderCode}
              </Descriptions.Item>

              <Descriptions.Item label={t('recipientName')}>
                {order?.shippingAddress?.name || '-'}
              </Descriptions.Item>

              <Descriptions.Item label={t('orderStatus')}>
                <div className="flex items-center gap-3">
                  {isCodPayment && (
                    <Select
                      value={status}
                      onChange={setStatus}
                      style={{ width: 160 }}
                      disabled={!isCodPayment}
                      options={[
                        { value: 'pending', label: t('pending') },
                        { value: 'processing', label: t('processing') },
                        { value: 'shipping', label: t('shipping') },
                        { value: 'completed', label: t('completed') },
                        { value: 'cancelled', label: t('cancelled') },
                      ]}
                    />
                  )}
                  {!isCodPayment && <Tag color={statusColor}>{status}</Tag>}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label={t('paymentMethod')}>
                {order.paymentMethod}
              </Descriptions.Item>

              <Descriptions.Item label={t('orderDate')}>
                {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>

              <Descriptions.Item label={t('orderTotal')}>
                <b>{formatUsd(order.total)}</b>
              </Descriptions.Item>
            </Descriptions>
            {isCodPayment && (
              <div className="flex justify-end">
                <Button type="primary" onClick={handleUpdateStatus}>
                  {t('updateStatus')}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT */}
        <Card title={t('itemsTitle')}>
          <Table
            rowKey={(r) => r.productId + r.size + r.color}
            columns={itemColumns}
            dataSource={order?.items}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
