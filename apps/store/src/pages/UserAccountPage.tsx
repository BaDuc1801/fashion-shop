import { useEffect } from 'react';
import { Tabs, Table, Card, Input, Button, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { ImageUploader } from '@shared';

import { useForm, Controller } from 'react-hook-form';

import {
  mapProfileToFormValues,
  useAccountProfile,
  useUpdateAccountProfile,
  type AccountProfileFormValues,
} from './UserAccountPage/hooks/useAccountProfile';

type OrderRecord = {
  key: string;
  code: string;
  date: string;
  dateValue: number;
  status: string;
  total: string;
  totalValue: number;
};

const UserAccountPage = () => {
  const { t } = useTranslation();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<AccountProfileFormValues>({
      defaultValues: {
        avatar: [],
        name: '',
        email: '',
        phone: '',
        address: '',
      },
    });

  const { data: profile, isLoading: isProfileLoading } = useAccountProfile();

  const updateProfileMutation = useUpdateAccountProfile();

  useEffect(() => {
    if (profile) {
      reset(mapProfileToFormValues(profile));
    }
  }, [profile, reset]);

  const handleProfileSubmit = async (values: AccountProfileFormValues) => {
    await updateProfileMutation.mutateAsync(values);
  };

  const avatarValue = watch('avatar');

  const orderColumns: ColumnsType<OrderRecord> = [
    {
      title: t('account.orders.code', 'Mã đơn'),
      dataIndex: 'code',
    },
    {
      title: t('account.orders.date', 'Ngày đặt'),
      dataIndex: 'date',
      sorter: (a, b) => a.dateValue - b.dateValue,
      defaultSortOrder: 'descend',
    },
    {
      title: t('account.orders.status', 'Trạng thái'),
      dataIndex: 'status',
    },
    {
      title: t('account.orders.total', 'Tổng tiền'),
      dataIndex: 'total',
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
  ];

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
                <form onSubmit={handleSubmit(handleProfileSubmit)}>
                  {/* AVATAR */}
                  <div className="mb-4">
                    <div className="mb-2">{t('account.profile.avatar')}</div>

                    <Controller
                      name="avatar"
                      control={control}
                      render={() => (
                        <ImageUploader
                          fileList={avatarValue ?? []}
                          onChange={(fileList) => setValue('avatar', fileList)}
                          maxCount={1}
                          multiple={false}
                        />
                      )}
                    />
                  </div>

                  {/* NAME */}
                  <div className="mb-4">
                    <div className="mb-2">{t('account.profile.name')}</div>

                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => <Input {...field} size="large" />}
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="mb-4">
                    <div className="mb-2">{t('account.profile.email')}</div>

                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} size="large" disabled />
                      )}
                    />
                  </div>

                  {/* PHONE */}
                  <div className="mb-4">
                    <div className="mb-2">{t('account.profile.phone')}</div>

                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => <Input {...field} size="large" />}
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="mb-4">
                    <div className="mb-2">{t('account.profile.address')}</div>

                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => <Input {...field} size="large" />}
                    />
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={updateProfileMutation.isPending}
                      disabled={isProfileLoading}
                    >
                      {t('account.profile.update')}
                    </Button>
                  </div>
                </form>
              </Card>
            ),
          },
          {
            key: 'orders',
            label: t('account.tabs.orders'),
            children: (
              <Card>
                <Table
                  dataSource={[]}
                  columns={orderColumns}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
        ]}
      />

      {isProfileLoading && (
        <div className="mt-6 flex justify-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default UserAccountPage;
