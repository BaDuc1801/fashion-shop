import { Avatar, Input, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AddNewButton from '../../components/common/AddNewButton';
import { Collection, collections } from './collectionsMockData';

const CollectionManagementPage = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredData = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchText.toLowerCase()) ||
      collection.slug.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns: ColumnsType<Collection> = useMemo(
    () => [
      {
        title: t('admin.collection.col.collection'),
        key: 'name',
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar shape="square" src={record.banner} />
            <div>{record.name}</div>
          </div>
        ),
      },
      { title: t('admin.collection.col.slug'), dataIndex: 'slug' },
      { title: t('admin.collection.col.products'), dataIndex: 'productsCount' },
      {
        title: t('admin.collection.col.startDate'),
        dataIndex: 'startDate',
        render: (startDate: Collection['startDate']) =>
          startDate.format('DD/MM/YYYY'),
      },
      {
        title: t('admin.collection.col.endDate'),
        dataIndex: 'endDate',
        render: (endDate: Collection['endDate']) => endDate.format('DD/MM/YYYY'),
      },
      {
        title: t('admin.collection.col.status'),
        dataIndex: 'status',
        render: (status: Collection['status']) => (
          <div className="flex items-center gap-2">
            <Tag
              color={
                status === 'active'
                  ? 'green'
                  : status === 'draft'
                    ? 'gold'
                    : status === 'expired'
                      ? 'red'
                      : 'default'
              }
            >
              {t(`admin.collection.status.${status}`)}
            </Tag>
          </div>
        ),
      },
      {
        title: t('admin.collection.col.featured'),
        dataIndex: 'featured',
        render: (featured: boolean) =>
          featured ? (
            <Tag color="blue">{t('admin.collection.col.featuredTag')}</Tag>
          ) : (
            <Tag>{t('admin.collection.col.normalTag')}</Tag>
          ),
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{t('admin.collection.title')}</span>
        <AddNewButton to="/collections/add-new" label={t('admin.collection.add')} />
      </div>
      <div className="flex items-center justify-end">
        <Input
          size="large"
          placeholder={t('admin.collection.searchPlaceholder')}
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
          onClick: () => navigate(`/collections/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default CollectionManagementPage;
