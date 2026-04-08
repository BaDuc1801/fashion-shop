import { Input, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../components/common/AddNewButton';
import { Voucher, vouchers } from './vouchersMockData';

const VoucherManagementPage = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredData = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<Voucher> = useMemo(
    () => [
      { title: t('admin.voucher.col.code'), dataIndex: 'code' },
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
          expiresAt.format('DD/MM/YYYY'),
        sorter: (a, b) =>
          a.expiresAt.toDate().getTime() - b.expiresAt.toDate().getTime(),
      },
      {
        title: t('admin.voucher.col.status'),
        dataIndex: 'status',
        render: (status: Voucher['status'], record) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={status === 'active'}
              onChange={(checked) => {
                console.log('Toggle voucher status:', record.id, checked);
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
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{t('admin.voucher.title')}</span>
        <AddNewButton to="/vouchers/add-new" label={t('admin.voucher.add')} />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.voucher.searchPlaceholder')}
          className="w-96"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Table
        className="w-full"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5, position: ['bottomCenter'] }}
        onRow={(record) => ({
          onClick: () => navigate(`/vouchers/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default VoucherManagementPage;
