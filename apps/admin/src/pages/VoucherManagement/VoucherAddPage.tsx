import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import VoucherForm from './VoucherForm';
import { useDebouncedValue, voucherService } from '@shared';
import { useQuery } from '@tanstack/react-query';
import { useCreateVoucher } from './hooks/useCreateVoucher';

const VoucherAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: listResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['vouchers', 'add-list', debouncedSearch],
    queryFn: () =>
      voucherService.getVouchers({
        search: debouncedSearch,
        page: 1,
        limit: 100,
      }),
  });

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.vouchers,
  };

  const createVoucherMutation = useCreateVoucher();

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/vouchers')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {t('admin.voucher.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.voucher.form.addTitle')} className="h-fit">
          <VoucherForm
            isEdit={false}
            showTitle={false}
            submitting={createVoucherMutation.isPending}
            onSubmit={async (values) => {
              await createVoucherMutation.mutateAsync({
                code: values.code,
                discountPercent: values.discountPercent,
                maxDiscount: values.maxDiscount,
                minOrderValue: values.minOrderValue,
                expiresAt: values.expiresAt.toISOString(),
                status: values.status ? 'active' : 'inactive',
                image: values.image?.[0]?.url,
              });
            }}
          />
        </Card>
        <Card
          title={t('admin.voucher.addPage.existingListTitle')}
          className="h-fit"
        >
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
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/vouchers/${item._id}`, { state: fromAddState })
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

export default VoucherAddPage;
