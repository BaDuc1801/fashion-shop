import { Avatar, Input, Switch, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../components/common/AddNewButton';
import { ConfirmModal, useDebouncedValue } from '@shared';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductData, productService } from '@shared';
import dayjs from 'dayjs';

const ProductManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    id: string;
    nextStatus: string;
    productName: string;
  } | null>(null);

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', debouncedSearch],
    queryFn: () =>
      productService.getProducts({
        search: debouncedSearch,
      }),
  });

  const products = productsResponse?.data || [];

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      productService.updateProduct(id, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success(t('admin.confirmModal.updateSuccess'));
      setPendingStatusUpdate(null);
    },
    onError: () => {
      setPendingStatusUpdate(null);
    },
  });

  const handleConfirmStatusUpdate = () => {
    if (!pendingStatusUpdate) return;
    updateStatusMutation.mutate({
      id: pendingStatusUpdate.id,
      status: pendingStatusUpdate.nextStatus,
    });
  };

  const columns: ColumnsType<ProductData> = useMemo(
    () => [
      {
        title: t('admin.product.col.product'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar shape="square" src={record.images?.[0]} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.product.col.sku'), dataIndex: 'sku' },
      {
        title: t('admin.product.col.price'),
        dataIndex: 'price',
        render: (price: number) => `$${price.toFixed(2)}`,
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: t('admin.product.col.stock'),
        key: 'stock',
        render: (_, record) => {
          const total = record.stock;
          return total > 0 ? (
            <Tag color="green">{total}</Tag>
          ) : (
            <Tag color="red">{t('admin.product.col.out')}</Tag>
          );
        },
        sorter: (a, b) => a.stock - b.stock,
      },
      {
        title: t('admin.product.col.created'),
        dataIndex: 'createdAt',
        render: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'),
      },
      {
        title: t('admin.product.col.status'),
        dataIndex: 'status',
        render: (status: string, record) => (
          <Switch
            checked={status === 'active'}
            onChange={(checked) => {
              setPendingStatusUpdate({
                id: record._id,
                nextStatus: checked ? 'active' : 'inactive',
                productName: record.name,
              });
            }}
            loading={
              updateStatusMutation.isPending &&
              pendingStatusUpdate?.id === record._id
            }
            onClick={(_, event) => event?.stopPropagation()}
          />
        ),
      },
    ],
    [t, updateStatusMutation.isPending, pendingStatusUpdate?.id],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">
          {t('admin.product.title')}
        </span>
        <AddNewButton to="/products/add-new" label={t('admin.product.add')} />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.product.searchPlaceholder')}
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        className="w-full"
        loading={isLoading}
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 5, position: ['bottomCenter'] }}
        onRow={(record) => ({
          onClick: () => navigate(`/products/${record.sku}`),
          style: { cursor: 'pointer' },
        })}
      />
      <ConfirmModal
        open={Boolean(pendingStatusUpdate)}
        title={t('admin.confirmModal.title')}
        productName={pendingStatusUpdate?.productName}
        confirmText={t('admin.confirmModal.confirmText')}
        cancelText={t('admin.confirmModal.cancelText')}
        loading={updateStatusMutation.isPending}
        onCancel={() => setPendingStatusUpdate(null)}
        onConfirm={handleConfirmStatusUpdate}
      />
    </div>
  );
};

export default ProductManagementPage;
