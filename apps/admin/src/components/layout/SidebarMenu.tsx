import {
  AppstoreOutlined,
  LockOutlined,
  GiftOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getApiErrorMessage, userService, useAuthStore } from '@shared';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, Input, Menu, Modal, Select, message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineRateReview } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  const changePasswordMutation = useMutation({
    mutationFn: (args: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(args),
    onSuccess: () => {
      message.success(t('admin.auth.changePasswordSuccess'));
      setChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangePasswordError('');
      useAuthStore.getState().clearSession();
      navigate('/login');
    },
    onError: (error) => {
      setChangePasswordError(
        getApiErrorMessage(error, t('admin.auth.changePasswordFailed')),
      );
    },
  });

  const items = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <HomeOutlined className="!text-base" />,
        label: t('admin.nav.dashboard'),
      },
      {
        key: '/users',
        icon: <UserOutlined className="!text-base" />,
        label: t('admin.nav.users'),
      },
      {
        key: '/orders',
        icon: <ShoppingCartOutlined className="!text-base" />,
        label: t('admin.nav.orders'),
      },
      {
        key: '/ratings',
        icon: <MdOutlineRateReview className="!text-base" />,
        label: t('ratingAndReview'),
      },
      {
        key: '/employees',
        icon: <UserOutlined className="!text-base" />,
        label: t('admin.nav.managers'),
      },
      {
        key: '/products',
        icon: <ShoppingOutlined className="!text-base" />,
        label: t('admin.nav.products'),
      },
      {
        key: '/categories',
        icon: <AppstoreOutlined className="!text-base" />,
        label: t('admin.nav.categories'),
      },
      {
        key: '/vouchers',
        icon: <GiftOutlined className="!text-base" />,
        label: t('admin.nav.vouchers'),
      },
    ],
    [t],
  );

  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key || '';

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError(t('admin.auth.requiredChangePasswordFields'));
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordError(t('admin.auth.passwordMin'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError(t('admin.auth.passwordNotMatch'));
      return;
    }
    setChangePasswordError('');
    await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
  };

  return (
    <div className="border-r border-gray-200 fixed flex h-screen w-80 flex-col bg-white">
      <div className="text-lg font-semibold mt-4 ms-7">
        {t('admin.common.welcome')}, {user?.name}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="min-h-0 flex-1 border-r-0 pt-2 text-base"
        items={items}
        onClick={(item) => {
          navigate(item.key);
        }}
      />
      <div className="border-t border-gray-200 p-4">
        <span className="mb-1 block text-xs text-gray-500">
          {t('admin.language.label')}
        </span>
        <Select
          className="w-full"
          value={i18n.language.startsWith('vi') ? 'vi' : 'en'}
          onChange={(lng) => void i18n.changeLanguage(lng)}
          options={[
            { value: 'en', label: t('admin.language.en') },
            { value: 'vi', label: t('admin.language.vi') },
          ]}
        />
        <Button
          block
          icon={<LockOutlined />}
          className="mt-3"
          onClick={() => {
            setChangePasswordOpen(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setChangePasswordError('');
          }}
        >
          {t('admin.auth.changePassword')}
        </Button>
        <Divider className="my-3" />
        <Button
          block
          onClick={() => {
            useAuthStore.getState().clearSession();
            navigate('/login');
          }}
        >
          {t('admin.auth.logout')}
        </Button>
      </div>
      <Modal
        title={t('admin.auth.changePassword')}
        open={changePasswordOpen}
        onCancel={() => setChangePasswordOpen(false)}
        onOk={() => void handleChangePassword()}
        okText={t('admin.auth.changePassword')}
        cancelText={t('admin.common.cancel')}
        confirmLoading={changePasswordMutation.isPending}
        destroyOnHidden
      >
        <div className="space-y-3 pt-2">
          <Input.Password
            size="large"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder={t('admin.auth.currentPassword')}
          />
          <Input.Password
            size="large"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder={t('admin.auth.newPassword')}
          />
          <Input.Password
            size="large"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t('admin.auth.confirmNewPassword')}
          />
          {changePasswordError ? (
            <p className="text-sm text-red-600">{changePasswordError}</p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default SidebarMenu;
