import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Input, List } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ADD_NEW_PATH,
  type ReturnToAddNewState,
} from '../../constants/addNewReturn';
import UserForm from './UserForm';
import { userService, useDebouncedValue } from '@shared';
import type { UserFormValues } from './schemas/userFormSchema';

const UserAddPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, 400);

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users', 'add-list', debouncedSearch],
    queryFn: () =>
      userService.getUsers({
        search: debouncedSearch,
        page: 1,
        limit: 100,
        role: 'customer',
      }),
  });

  const createUserMutation = useMutation({
    mutationFn: (values: UserFormValues) =>
      userService.createUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        status: values.status ? 'active' : 'inactive',
        role: 'customer',
      }),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(`/users/${created._id}`);
    },
  });

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
          <UserForm
            isEdit={false}
            showTitle={false}
            submitting={createUserMutation.isPending}
            onSubmit={async (values) => {
              await createUserMutation.mutateAsync(values);
            }}
          />
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
              dataSource={usersResponse?.data ?? []}
              loading={isLoading}
              locale={{ emptyText: t('admin.common.noData') }}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/users/${item._id}`, { state: fromAddState })
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
