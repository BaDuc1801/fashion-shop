import { Avatar, Input, Switch, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConfirmModal, UserMeData, userService, useTableQuery } from '@shared';
import dayjs from 'dayjs';

const UserManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    id: string;
    nextStatus: string;
    userName: string;
  } | null>(null);

  const { page, limit, search, searchText, setSearchText, onPageChange } =
    useTableQuery({
      defaultLimit: 10,
    });

  const queryParams = {
    search,
    page,
    limit,
    role: 'customer',
  };

  const { data, isLoading } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => userService.getUsers(queryParams),
  });

  const users = data?.data || [];
  const total = data?.total || 0;

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'inactive';
    }) => userService.updateUser(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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

  const columns: ColumnsType<UserMeData> = useMemo(
    () => [
      {
        title: t('admin.user.col.user'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar src={record.avatar} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.user.col.email'), dataIndex: 'email' },
      {
        title: t('admin.user.col.phone'),
        dataIndex: 'phone',
        render: (val: string) => val || '-',
      },
      {
        title: t('admin.user.col.joinDate'),
        dataIndex: 'createdAt',
        render: (val: string) => dayjs(val).format('DD/MM/YYYY'),
      },
      {
        title: t('admin.user.col.status'),
        dataIndex: 'status',
        render: (status: 'active' | 'inactive', record) => (
          <Switch
            checked={status === 'active'}
            onChange={(checked) => {
              setPendingStatusUpdate({
                id: record._id,
                nextStatus: checked ? 'active' : 'inactive',
                userName: record.name,
              });
            }}
            onClick={(_, e) => e?.stopPropagation()}
          />
        ),
      },
    ],
    [t, setPendingStatusUpdate],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{t('admin.user.title')}</span>
      </div>

      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.user.searchPlaceholder')}
          className="w-96"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        className="w-full"
        loading={isLoading}
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: onPageChange,
          position: ['bottomCenter'],
        }}
        onRow={(record) => ({
          onClick: () => navigate(`/users/${record._id}`),
          style: { cursor: 'pointer' },
        })}
      />
      <ConfirmModal
        open={Boolean(pendingStatusUpdate)}
        title={t('admin.confirmModal.title')}
        userName={pendingStatusUpdate?.userName}
        confirmText={t('admin.confirmModal.confirmText')}
        cancelText={t('admin.confirmModal.cancelText')}
        loading={updateStatusMutation.isPending}
        onCancel={() => setPendingStatusUpdate(null)}
        onConfirm={handleConfirmStatusUpdate}
      />
    </div>
  );
};

export default UserManagementPage;
