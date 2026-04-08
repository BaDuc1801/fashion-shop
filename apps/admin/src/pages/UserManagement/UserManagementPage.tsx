import { Avatar, Input, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, users } from './usersMockData';

const UserManagementPage = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredData = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText),
  );

  const columns: ColumnsType<User> = useMemo(
    () => [
      {
        title: t('admin.user.col.user'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar src={record.avatar.url} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.user.col.email'), dataIndex: 'email' },
      { title: t('admin.user.col.phone'), dataIndex: 'phone' },
      {
        title: t('admin.user.col.joinDate'),
        dataIndex: 'joinDate',
        render: (joinDate: User['joinDate']) => joinDate.format('DD/MM/YYYY'),
        sorter: (a, b) =>
          a.joinDate.toDate().getTime() - b.joinDate.toDate().getTime(),
      },
      {
        title: t('admin.user.col.status'),
        dataIndex: 'status',
        render: (status: User['status'], record) => (
          <Switch
            checked={status === 'active'}
            onChange={(checked) => {
              console.log('Toggle user status:', record.id, checked);
            }}
            onClick={(_, event) => event?.stopPropagation()}
          />
        ),
      },
    ],
    [t],
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
          onClick: () => navigate(`/users/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default UserManagementPage;
