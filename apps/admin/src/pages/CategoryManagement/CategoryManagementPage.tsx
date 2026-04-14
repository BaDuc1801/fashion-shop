import { Avatar, Input, message, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../components/common/AddNewButton';
import {
  Category,
  categoryService,
  ConfirmModal,
  useTableQuery,
} from '@shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

const CategoryManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    id: string;
    nextStatus: string;
    categoryName: string;
  } | null>(null);

  const { page, limit, search, searchText, setSearchText, onPageChange } =
    useTableQuery({
      defaultLimit: 10,
    });

  const queryParams = {
    search,
    page,
    limit,
  };

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['categories', queryParams],
    queryFn: () => categoryService.getCategories(queryParams),
  });

  const categories = categoriesResponse?.data || [];

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'inactive';
    }) => categoryService.updateCategory(id, { status }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
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
      status: pendingStatusUpdate.nextStatus as 'active' | 'inactive',
    });
  };

  const columns: ColumnsType<Category> = useMemo(
    () => [
      {
        title: t('admin.category.col.category'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar shape="square" src={record.image} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.category.col.slug'), dataIndex: 'slug' },
      {
        title: t('admin.category.col.products'),
        dataIndex: 'productCount',
        sorter: (a, b) => a.productCount - b.productCount,
      },
      {
        title: t('admin.category.col.created'),
        dataIndex: 'createdAt',
        render: (createdAt: Category['createdAt']) =>
          dayjs(createdAt).format('DD/MM/YYYY'),
      },
      {
        title: t('admin.category.col.status'),
        dataIndex: 'status',
        render: (status: Category['status'], record) => (
          <Switch
            checked={status === 'active'}
            onChange={(checked) => {
              setPendingStatusUpdate({
                id: record._id,
                nextStatus: checked ? 'active' : 'inactive',
                categoryName: record.name,
              });
            }}
            onClick={(_, event) => event?.stopPropagation()}
            loading={
              updateStatusMutation.isPending &&
              pendingStatusUpdate?.id === record._id
            }
          />
        ),
      },
    ],
    [pendingStatusUpdate?.id, t, updateStatusMutation.isPending],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">
          {t('admin.category.title')}
        </span>
        <AddNewButton
          to="/categories/add-new"
          label={t('admin.category.add')}
        />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.category.searchPlaceholder')}
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>
      <Table
        className="w-full"
        loading={isLoading}
        columns={columns}
        dataSource={categories}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: categoriesResponse?.total,
          onChange: onPageChange,
          position: ['bottomCenter'],
        }}
        onRow={(record) => ({
          onClick: () => navigate(`/categories/${record._id}`),
          style: { cursor: 'pointer' },
        })}
      />
      <ConfirmModal
        open={Boolean(pendingStatusUpdate)}
        title={t('admin.confirmModal.title')}
        categoryName={pendingStatusUpdate?.categoryName}
        confirmText={t('admin.confirmModal.confirmText')}
        cancelText={t('admin.confirmModal.cancelText')}
        loading={updateStatusMutation.isPending}
        onCancel={() => setPendingStatusUpdate(null)}
        onConfirm={handleConfirmStatusUpdate}
      />
    </div>
  );
};

export default CategoryManagementPage;
