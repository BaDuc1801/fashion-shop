import { Avatar, Input, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddNewButton from '../../components/common/AddNewButton';
import { Category, categories } from './categoriesMockData';

const CategoryManagementPage = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const filteredData = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchText.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<Category> = useMemo(
    () => [
      {
        title: t('admin.category.col.category'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar shape="square" src={record.icon} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.category.col.slug'), dataIndex: 'slug' },
      {
        title: t('admin.category.col.products'),
        dataIndex: 'productsCount',
        sorter: (a, b) => a.productsCount - b.productsCount,
      },
      {
        title: t('admin.category.col.created'),
        dataIndex: 'createdAt',
        render: (createdAt: Category['createdAt']) =>
          createdAt.format('DD/MM/YYYY'),
      },
      {
        title: t('admin.category.col.status'),
        dataIndex: 'status',
        render: (status: Category['status']) => (
          <Switch
            checked={status === 'active'}
            onChange={(checked) => {
              console.log(checked);
            }}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">
          {t('admin.category.title')}
        </span>
        <AddNewButton
          to="/categories/add-new"
          label={t('admin.category.add')}
        />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.category.searchPlaceholder')}
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
      />
    </div>
  );
};

export default CategoryManagementPage;
