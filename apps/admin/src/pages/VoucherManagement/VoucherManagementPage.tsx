import { Avatar, Input, message, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../components/common/AddNewButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConfirmModal, useTableQuery, Voucher, voucherService } from '@shared';
import dayjs from 'dayjs';

const VoucherManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    id: string;
    nextStatus: string;
    voucherCode: string;
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

  const { data: vouchersResponse, isLoading } = useQuery({
    queryKey: ['vouchers', queryParams],
    queryFn: () => voucherService.getVouchers(queryParams),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'inactive';
    }) => voucherService.updateVoucher(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
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

  const columns: ColumnsType<Voucher> = useMemo(
    () => [
      {
        title: t('admin.voucher.col.code'),
        dataIndex: 'code',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar src={record.image} />
            <div>{record.code}</div>
          </div>
        ),
      },
      {
        title: t('admin.voucher.col.discount'),
        dataIndex: 'discountPercent',
        render: (discountPercent: number) => `${discountPercent}%`,
        sorter: (a, b) => a.discountPercent - b.discountPercent,
      },
      {
        title: t('admin.voucher.col.maxDiscount'),
        dataIndex: 'maxDiscount',
        render: (maxDiscount: number) => `$${maxDiscount.toFixed(2)}`,
      },
      {
        title: t('admin.voucher.col.minOrder'),
        dataIndex: 'minOrderValue',
        render: (minOrderValue: number) => `$${minOrderValue.toFixed(2)}`,
      },
      {
        title: t('admin.voucher.col.expireDate'),
        dataIndex: 'expiresAt',
        render: (expiresAt: Voucher['expiresAt']) =>
          dayjs(expiresAt).format('DD/MM/YYYY'),
        sorter: (a, b) => dayjs(a.expiresAt).diff(dayjs(b.expiresAt)),
      },
      {
        title: t('admin.voucher.col.status'),
        dataIndex: 'status',
        render: (status: Voucher['status'], record) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={status === 'active'}
              onChange={(checked) => {
                setPendingStatusUpdate({
                  id: record._id,
                  nextStatus: checked ? 'active' : 'inactive',
                  voucherCode: record.code,
                });
              }}
              onClick={(_, event) => event?.stopPropagation()}
            />
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl font-semibold">{t('admin.voucher.title')}</span>
      <div className="flex flex-col mt-1 gap-4 justify-end items-end">
        <AddNewButton to="/vouchers/add-new" label={t('admin.voucher.add')} />
        <Input
          size="large"
          placeholder={t('admin.voucher.searchPlaceholder')}
          className="w-96"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Table
          className="w-full"
          loading={isLoading}
          columns={columns}
          dataSource={vouchersResponse?.data || []}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: vouchersResponse?.total,
            onChange: onPageChange,
            position: ['bottomCenter'],
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/vouchers/${record._id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      <ConfirmModal
        open={Boolean(pendingStatusUpdate)}
        title={t('admin.confirmModal.title')}
        voucherCode={pendingStatusUpdate?.voucherCode}
        confirmText={t('admin.confirmModal.confirmText')}
        cancelText={t('admin.confirmModal.cancelText')}
        loading={updateStatusMutation.isPending}
        onCancel={() => setPendingStatusUpdate(null)}
        onConfirm={handleConfirmStatusUpdate}
      />
    </div>
  );
};

export default VoucherManagementPage;
