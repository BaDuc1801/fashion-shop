import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import UserForm from './UserForm';
import { User, users } from './usersMockData';

const UserDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.users;
  const [searchText, setSearchText] = useState('');
  const user = users.find((item) => item.id === id);
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phone.includes(searchText),
      ),
    [searchText],
  );
  type PurchaseOrder = User['purchaseHistory'][number];
  type PurchaseItem = PurchaseOrder['items'][number];

  const purchaseColumns: ColumnsType<PurchaseOrder> = useMemo(
    () => [
      { title: t('admin.user.purchaseCol.orderId'), dataIndex: 'orderId' },
      {
        title: t('admin.user.purchaseCol.purchasedAt'),
        dataIndex: 'purchasedAt',
        render: (purchasedAt: User['purchaseHistory'][number]['purchasedAt']) =>
          purchasedAt.format('DD/MM/YYYY'),
        sorter: (a, b) =>
          a.purchasedAt.toDate().getTime() - b.purchasedAt.toDate().getTime(),
      },
      {
        title: t('admin.user.purchaseCol.totalAmount'),
        dataIndex: 'totalAmount',
        render: (totalAmount: number) => `$${totalAmount.toFixed(2)}`,
        sorter: (a, b) => a.totalAmount - b.totalAmount,
      },
      {
        title: t('admin.user.purchaseCol.status'),
        dataIndex: 'status',
        render: (status: User['purchaseHistory'][number]['status']) => (
          <Tag
            color={
              status === 'completed'
                ? 'green'
                : status === 'shipping'
                  ? 'blue'
                  : 'red'
            }
          >
            {t(`admin.dashboard.orderStatus.${status}`)}
          </Tag>
        ),
      },
    ],
    [t],
  );

  const purchaseItemColumns: ColumnsType<PurchaseItem> = useMemo(
    () => [
      { title: t('admin.user.purchaseCol.product'), dataIndex: 'productName' },
      { title: t('admin.user.purchaseCol.quantity'), dataIndex: 'quantity' },
      {
        title: t('admin.user.purchaseCol.unitPrice'),
        dataIndex: 'unitPrice',
        render: (unitPrice: number) => `$${unitPrice.toFixed(2)}`,
      },
      {
        title: t('admin.user.purchaseCol.subtotal'),
        render: (_, item) => `$${(item.quantity * item.unitPrice).toFixed(2)}`,
      },
    ],
    [t],
  );

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(isFromAddPage ? ADD_NEW_PATH.users : '/users')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {isFromAddPage
          ? t('admin.user.detail.backToAddNew')
          : t('admin.user.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card title={t('admin.user.form.editTitle')}>
            <UserForm initialValues={user} isEdit showTitle={false} />
          </Card>
          <Card title={t('admin.user.purchaseHistory')}>
            <Table
              rowKey="orderId"
              columns={purchaseColumns}
              dataSource={user?.purchaseHistory || []}
              pagination={{ pageSize: 5, position: ['bottomCenter'] }}
              expandable={{
                expandedRowRender: (order) => (
                  <Table
                    rowKey={(item) => `${order.orderId}-${item.productName}`}
                    columns={purchaseItemColumns}
                    dataSource={order.items}
                    pagination={false}
                    size="small"
                  />
                ),
              }}
            />
          </Card>
        </div>
        <Card title={t('admin.user.detail.listTitle')} className="h-fit">
          <Input
            placeholder={t('admin.user.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={filteredUsers}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item.id === id ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/users/${item.id}`, { state: location.state })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.phone}</span>
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

export default UserDetailPage;
