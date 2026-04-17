import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import UserForm from './UserForm';
import { userService, useDebouncedValue } from '@shared';
import { useUpdateUser } from './hooks/useUpdateUser';
import UserOrderHistory from './UserOrderHistory';

const UserDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as ReturnToAddNewState | null)?.returnTo;
  const isFromAddPage = returnTo === ADD_NEW_PATH.users;
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: listResponse, isLoading: isListLoading } = useQuery({
    queryKey: ['users', 'detail-list', debouncedSearch],
    queryFn: () =>
      userService.getUsers({
        search: debouncedSearch,
        page: 1,
        limit: 100,
        role: 'customer',
      }),
  });

  const { data: userResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ['users', 'detail-by-id', id],
    enabled: Boolean(id),
    retry: false,
    queryFn: () => {
      if (!id) throw new Error('Missing user id');
      return userService.getUserById(id);
    },
  });

  const updateUserMutation = useUpdateUser({
    userId: userResponse?._id,
    currentUserId: id,
  });

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
        <Card title={t('admin.user.form.editTitle')} loading={isUserLoading}>
          <UserForm
            initialValues={userResponse}
            isEdit
            showTitle={false}
            submitting={updateUserMutation.isPending}
            onSubmit={async (values) => {
              await updateUserMutation.mutateAsync(values);
            }}
          />
        </Card>
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
              dataSource={listResponse?.data ?? []}
              loading={isListLoading}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className={`cursor-pointer ${
                    item._id === id ? 'bg-slate-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    navigate(`/users/${item._id}`, { state: location.state })
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
      <UserOrderHistory />
    </div>
  );
};

export default UserDetailPage;
