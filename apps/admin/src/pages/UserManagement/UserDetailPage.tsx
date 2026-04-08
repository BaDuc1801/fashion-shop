import { Card, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import UserForm from './UserForm';
import { User, users } from './usersMockData';

const UserDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const user = users.find((item) => item.id === id);
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
    <div className="flex flex-col gap-6">
      <UserForm initialValues={user} isEdit />
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
  );
};

export default UserDetailPage;
