import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import UserForm from './UserForm';
import { users } from './usersMockData';

const UserAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phone.includes(searchText),
      ),
    [searchText],
  );

  const fromAddState: ReturnToAddNewState = {
    returnTo: ADD_NEW_PATH.users,
  };

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/users')}
        className="!flex w-fit items-center gap-1 text-slate-700 mb-4"
      >
        {t('admin.user.detail.back')}
      </Button>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title={t('admin.user.form.addTitle')} className="h-fit">
          <UserForm isEdit={false} showTitle={false} />
        </Card>
        <Card
          title={t('admin.user.addPage.existingListTitle')}
          className="h-fit"
        >
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
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/users/${item.id}`, { state: fromAddState })
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

export default UserAddPage;
