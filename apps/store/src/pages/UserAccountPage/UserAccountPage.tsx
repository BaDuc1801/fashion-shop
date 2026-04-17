import { useEffect } from 'react';
import { Card, Input, Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { ImageUploader } from '@shared';

import { useForm, Controller } from 'react-hook-form';

import {
  mapProfileToFormValues,
  useAccountProfile,
  useUpdateAccountProfile,
  type AccountProfileFormValues,
} from './hooks/useAccountProfile';

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

  return (
    <div className="px-[200px] py-[40px]">
      <h1 className="text-2xl font-semibold mb-2">{t('account.title')}</h1>
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
              render={({ field }) => <Input {...field} size="large" disabled />}
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

      {isProfileLoading && (
        <div className="mt-6 flex justify-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default UserAccountPage;
