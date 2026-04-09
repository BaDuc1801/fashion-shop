import { useState } from 'react';
import { Tabs, Table, Card, Form, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

const mockUser = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901 234 567',
  address: '123 Đường Thời Trang, Quận 1, TP.HCM',
};

type OrderRecord = {
  key: string;
  code: string;
  date: string;
  dateValue: number;
  status: string;
  total: string;
  totalValue: number;
};

const mockOrders: OrderRecord[] = [
  {
    key: '1',
    code: 'ORD-20260401-001',
    date: '01/04/2026',
    dateValue: new Date(2026, 3, 1).getTime(),
    status: 'Đang giao',
    total: '1.250.000₫',
    totalValue: 1250000,
  },
  {
    key: '2',
    code: 'ORD-20260328-002',
    date: '28/03/2026',
    dateValue: new Date(2026, 2, 28).getTime(),
    status: 'Hoàn tất',
    total: '990.000₫',
    totalValue: 990000,
  },
  {
    key: '3',
    code: 'ORD-20260315-003',
    date: '15/03/2026',
    dateValue: new Date(2026, 2, 15).getTime(),
    status: 'Hoàn tất',
    total: '890.000₫',
    totalValue: 890000,
  },
  {
    key: '4',
    code: 'ORD-20260301-004',
    date: '01/03/2026',
    dateValue: new Date(2026, 2, 1).getTime(),
    status: 'Đang chuẩn bị',
    total: '1.520.000₫',
    totalValue: 1520000,
  },
  {
    key: '5',
    code: 'ORD-20260220-005',
    date: '20/02/2026',
    dateValue: new Date(2026, 1, 20).getTime(),
    status: 'Hoàn tất',
    total: '450.000₫',
    totalValue: 450000,
  },
  {
    key: '6',
    code: 'ORD-20260210-006',
    date: '10/02/2026',
    dateValue: new Date(2026, 1, 10).getTime(),
    status: 'Đã hủy',
    total: '0₫',
    totalValue: 0,
  },
  {
    key: '7',
    code: 'ORD-20260125-007',
    date: '25/01/2026',
    dateValue: new Date(2026, 0, 25).getTime(),
    status: 'Hoàn tất',
    total: '2.300.000₫',
    totalValue: 2300000,
  },
  {
    key: '8',
    code: 'ORD-20260110-008',
    date: '10/01/2026',
    dateValue: new Date(2026, 0, 10).getTime(),
    status: 'Hoàn tất',
    total: '780.000₫',
    totalValue: 780000,
  },
  {
    key: '9',
    code: 'ORD-20251228-009',
    date: '28/12/2025',
    dateValue: new Date(2025, 11, 28).getTime(),
    status: 'Hoàn tất',
    total: '1.050.000₫',
    totalValue: 1050000,
  },
  {
    key: '10',
    code: 'ORD-20251210-010',
    date: '10/12/2025',
    dateValue: new Date(2025, 11, 10).getTime(),
    status: 'Hoàn tất',
    total: '320.000₫',
    totalValue: 320000,
  },
  {
    key: '11',
    code: 'ORD-20251122-011',
    date: '22/11/2025',
    dateValue: new Date(2025, 10, 22).getTime(),
    status: 'Hoàn tất',
    total: '1.800.000₫',
    totalValue: 1800000,
  },
  {
    key: '12',
    code: 'ORD-20251105-012',
    date: '05/11/2025',
    dateValue: new Date(2025, 10, 5).getTime(),
    status: 'Hoàn tất',
    total: '610.000₫',
    totalValue: 610000,
  },
];

const UserAccountPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [user] = useState(mockUser);

  const orderColumns: ColumnsType<OrderRecord> = [
    {
      title: t('account.orders.code', 'Mã đơn'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('account.orders.date', 'Ngày đặt'),
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.dateValue - b.dateValue,
      defaultSortOrder: 'descend',
    },
    {
      title: t('account.orders.status', 'Trạng thái'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('account.orders.total', 'Tổng tiền'),
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
  ];

  const handleProfileSubmit = () => {
    const values = form.getFieldsValue();
    // Mock: ở đây có thể gửi API cập nhật profile trong tương lai
    void values;
  };

  return (
    <div className="px-[200px] py-[40px]">
      <h1 className="text-2xl font-semibold mb-2">{t('account.title')}</h1>
      <Tabs
        defaultActiveKey="profile"
        items={[
          {
            key: 'profile',
            label: t('account.tabs.profile'),
            children: (
              <Card>
                <Form
                  layout="vertical"
                  form={form}
                  initialValues={user}
                  onFinish={handleProfileSubmit}
                >
                  <Form.Item label={t('account.profile.name')} name="name">
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item label={t('account.profile.email')} name="email">
                    <Input disabled size="large" />
                  </Form.Item>
                  <Form.Item label={t('account.profile.phone')} name="phone">
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item
                    label={t('account.profile.address')}
                    name="address"
                  >
                    <Input size="large" />
                  </Form.Item>
                  <div className="flex justify-end mt-2">
                    <Button type="primary" htmlType="submit" size="large">
                      {t('account.profile.update')}
                    </Button>
                  </div>
                </Form>
              </Card>
            ),
          },
          {
            key: 'orders',
            label: t('account.tabs.orders'),
            children: (
              <Card>
                <Table
                  dataSource={mockOrders}
                  columns={orderColumns}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default UserAccountPage;
