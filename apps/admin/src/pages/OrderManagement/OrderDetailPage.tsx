import { ArrowLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type { OrderLineItem } from './ordersMockData';
import { orders } from './ordersMockData';

const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === id);

  const itemColumns: ColumnsType<OrderLineItem> = useMemo(
    () => [
      {
        title: t('admin.order.detail.itemCol.product'),
        key: 'product',
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Avatar
              shape="square"
              size={48}
              src={row.thumbnail}
              className="flex-shrink-0 bg-slate-100"
            >
              {row.productName.slice(0, 1)}
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium text-slate-900">{row.productName}</div>
              <div className="text-xs text-slate-500">{row.sku}</div>
            </div>
          </div>
        ),
      },
      {
        title: t('admin.order.detail.itemCol.quantity'),
        dataIndex: 'quantity',
        key: 'quantity',
        width: 90,
        align: 'center',
      },
      {
        title: t('admin.order.detail.itemCol.unitPrice'),
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 120,
        render: (v: number) => formatUsd(v),
      },
      {
        title: t('admin.order.detail.itemCol.subtotal'),
        key: 'subtotal',
        width: 120,
        align: 'right',
        render: (_, row) => formatUsd(row.quantity * row.unitPrice),
      },
    ],
    [t],
  );

  if (!order) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-slate-600">{t('admin.order.detail.notFound')}</p>
        <Button type="link" onClick={() => navigate('/orders')} className="w-fit p-0">
          ← {t('admin.order.detail.back')}
        </Button>
      </div>
    );
  }

  const statusColor =
    order.status === 'completed'
      ? 'green'
      : order.status === 'shipping'
        ? 'blue'
        : order.status === 'pending'
          ? 'gold'
          : 'red';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
          className="!flex items-center gap-1 text-slate-700"
        >
          {t('admin.order.detail.back')}
        </Button>
      </div>

      <Card title={t('admin.order.detail.summaryTitle')} className="shadow-sm">
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label={t('admin.order.col.orderId')}>
            {order.id}
          </Descriptions.Item>
          <Descriptions.Item label={t('admin.order.col.customer')}>
            {order.customerName}
          </Descriptions.Item>
          <Descriptions.Item label={t('admin.order.col.status')}>
            <Tag color={statusColor}>
              {t(`admin.dashboard.orderStatus.${order.status}`)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('admin.order.col.placedAt')}>
            {order.placedAt.format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label={t('admin.order.col.total')}>
            <span className="font-semibold text-slate-900">
              {formatUsd(order.total)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('admin.order.detail.itemsTitle')} className="shadow-sm">
        <Table<OrderLineItem>
          rowKey="id"
          columns={itemColumns}
          dataSource={order.items}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default OrderDetailPage;
