import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import CollectionForm from './CollectionForm';
import { collections } from './collectionsMockData';

const CollectionAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredCollections = useMemo(
    () =>
      collections.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.slug.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [searchText],
  );

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.collections,
  };

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/collections')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {t('admin.collection.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.collection.form.addTitle')} className="h-fit">
          <CollectionForm isEdit={false} showTitle={false} />
        </Card>
        <Card
          title={t('admin.collection.addPage.existingListTitle')}
          className="h-fit"
        >
          <Input
            placeholder={t('admin.collection.detail.listSearchPlaceholder')}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="mb-4"
          />
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <List
              bordered
              dataSource={filteredCollections}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/collections/${item.id}`, {
                      state: fromAddState,
                    })
                  }
                >
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{item.name}</span>
                    <span className="text-xs text-slate-500">{item.slug}</span>
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

export default CollectionAddPage;
