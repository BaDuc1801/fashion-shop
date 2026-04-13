import {
  AppstoreOutlined,
  GiftOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@shared';
import { Button, Menu, Select } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);

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
        key: '/collections',
        icon: <AppstoreOutlined className="!text-base" />,
        label: t('admin.nav.collections'),
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
          className="mt-3"
          onClick={() => {
            useAuthStore.getState().clearSession();
            navigate('/login');
          }}
        >
          {t('admin.auth.logout')}
        </Button>
      </div>
    </div>
  );
};

export default SidebarMenu;
