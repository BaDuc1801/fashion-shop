import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import VoucherForm from './VoucherForm';
import { useDebouncedValue, voucherService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { useUpdateVoucher } from './hooks/useUpdateVoucher';
import { useDeleteVoucher } from './hooks/useDeleteVoucher';

const VoucherDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.vouchers;
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: listResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['vouchers', 'detail-list', debouncedSearch],
    queryFn: () =>
      voucherService.getVouchers({
        search: debouncedSearch,
        page: 1,
        limit: 100,
      }),
  });

  const { data: voucherResponse, isLoading: isVoucherLoading } = useQuery({
    queryKey: ['vouchers', 'detail-by-id', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: () => {
      if (!id) throw new Error('Missing voucher id');
      return voucherService.getVoucherById(id);
    },
  });

  const updateVoucherMutation = useUpdateVoucher({
    voucherId: voucherResponse?._id,
    currentVoucherId: id,
  });
  const deleteVoucherMutation = useDeleteVoucher({
    voucherId: voucherResponse?._id,
  });

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          navigate(isFromAddPage ? ADD_NEW_PATH.vouchers : '/vouchers')
        }
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {isFromAddPage
          ? t('admin.voucher.detail.backToAddNew')
          : t('admin.voucher.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title={t('admin.voucher.form.editTitle')}
          loading={isVoucherLoading}
          extra={
            <Popconfirm
              title={t('admin.voucher.form.deleteConfirm')}
              okText={t('admin.confirmModal.confirmText')}
              cancelText={t('admin.confirmModal.cancelText')}
              onConfirm={() => deleteVoucherMutation.mutate()}
            >
              <Button danger loading={deleteVoucherMutation.isPending}>
                {t('admin.voucher.form.delete')}
              </Button>
            </Popconfirm>
          }
        >
          <VoucherForm
            initialValues={voucherResponse}
            isEdit
            showTitle={false}
            submitting={updateVoucherMutation.isPending}
            onSubmit={async (values) => {
              await updateVoucherMutation.mutateAsync(values);
            }}
          />
        </Card>
        <Card title={t('admin.voucher.detail.listTitle')} className="h-fit">
          <Input
            placeholder={t('admin.voucher.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={listResponse?.data}
              loading={isListLoading}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item._id === id ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/vouchers/${item._id}`, { state: location.state })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.code}</span>
                    <span className="text-xs text-slate-500">
                      {item.discountPercent}%
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VoucherDetailPage;
