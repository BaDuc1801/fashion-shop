import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import VoucherForm from './VoucherForm';
import { vouchers } from './vouchersMockData';

const VoucherAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredVouchers = useMemo(
    () =>
      vouchers.filter((item) =>
        item.code.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [searchText],
  );

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.vouchers,
  };

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
          <VoucherForm isEdit={false} showTitle={false} />
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
              dataSource={filteredVouchers}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/vouchers/${item.id}`, { state: fromAddState })
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
