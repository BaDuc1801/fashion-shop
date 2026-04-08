import { Avatar, Input, Switch, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../components/common/AddNewButton';
import { Product, products } from './productsMockData';

const ProductManagementPage = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredData = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: t('admin.product.col.product'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar shape="square" src={record.thumbnail} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.product.col.sku'), dataIndex: 'sku' },
      {
        title: t('admin.product.col.price'),
        dataIndex: 'price',
        render: (price: number) => `$${price.toFixed(2)}`,
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: t('admin.product.col.stock'),
        dataIndex: 'stock',
        render: (stock: number) =>
          stock > 0 ? (
            <Tag color="green">{stock}</Tag>
          ) : (
            <Tag color="red">{t('admin.product.col.out')}</Tag>
          ),
        sorter: (a, b) => a.stock - b.stock,
      },
      {
        title: t('admin.product.col.created'),
        dataIndex: 'createdAt',
        render: (createdAt: Product['createdAt']) => createdAt.format('DD/MM/YYYY'),
      },
      {
        title: t('admin.product.col.status'),
        dataIndex: 'status',
        render: (status: Product['status'], record) => (
          <Switch
            checked={status === 'active'}
            onChange={(checked) => {
              console.log('Toggle product status:', record.id, checked);
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
        <span className="text-xl font-semibold">{t('admin.product.title')}</span>
        <AddNewButton to="/products/add-new" label={t('admin.product.add')} />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.product.searchPlaceholder')}
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
          onClick: () => navigate(`/products/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default ProductManagementPage;
