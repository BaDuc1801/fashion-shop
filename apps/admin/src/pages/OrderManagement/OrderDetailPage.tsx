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
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { orderService, formatUsd } from '@shared';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';

type OrderItem = {
  productId: string;
  nameSnapshot: string;
  nameEnSnapshot: string;
  imageSnapshot: string;
  skuSnapshot: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

type FormValues = {
  status: string;
  phone: string;
  address: string;
};

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id as string),
    enabled: !!id,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      status: '',
      phone: '',
      address: '',
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: (data: FormValues) =>
      orderService.updateOrderStatus(
        id as string,
        data.status,
        data.phone,
        data.address,
      ),
    onSuccess: (_, variables) => {
      message.success(t('orderUpdated'));

      reset(variables);
    },
    onError: () => {
      message.error(t('orderUpdateFailed'));
    },
  });

  useEffect(() => {
    if (order) {
      reset({
        status: order.orderStatus,
        phone: order?.shippingAddress?.phone || '',
        address: order?.shippingAddress?.address || '',
      });
    }
  }, [order, reset]);

  const handleUpdate = handleSubmit((data) => {
    updateOrderMutation.mutate(data);
  });

  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: t('product'),
      key: 'product',
      width: 400,
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
            <div className="font-medium">
              {i18n.language === 'en' ? row.nameEnSnapshot : row.nameSnapshot}
            </div>
            <div className="text-xs text-slate-500">{row.skuSnapshot}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              {row.size} /
              <div
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: row.color }}
              />
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
        <Card title={t('summaryTitle')}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('orderCode')}>
              {order.orderCode}
            </Descriptions.Item>

            <Descriptions.Item label={t('recipientName')}>
              {order?.shippingAddress?.name || '-'}
            </Descriptions.Item>

            <Descriptions.Item label={t('phoneNumber')}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <Input {...field} className="w-32" />}
              />
            </Descriptions.Item>

            <Descriptions.Item label={t('address')}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <Input.TextArea {...field} autoSize />}
              />
            </Descriptions.Item>

            <Descriptions.Item label={t('orderStatus')}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: 160 }}
                    options={[
                      {
                        value: 'pending',
                        label: <Tag color="gold">Pending</Tag>,
                      },
                      { value: 'paid', label: <Tag color="lime">Paid</Tag> },
                      {
                        value: 'shipping',
                        label: <Tag color="blue">Shipping</Tag>,
                      },
                      {
                        value: 'completed',
                        label: <Tag color="green">Completed</Tag>,
                      },
                      {
                        value: 'cancelled',
                        label: <Tag color="red">Cancelled</Tag>,
                      },
                    ]}
                  />
                )}
              />
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

          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              disabled={!isDirty}
              loading={updateOrderMutation.isPending}
              onClick={handleUpdate}
            >
              {t('update')}
            </Button>
          </div>
        </Card>

        {/* RIGHT */}
        <Card title={t('itemsTitle')}>
          <Table
            rowKey={(r) => r.productId + r.size + r.color}
            columns={itemColumns}
            dataSource={order.items}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
