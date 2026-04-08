import {
  AppstoreOutlined,
  GiftOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Select } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const items = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <HomeOutlined />,
        label: t('admin.nav.dashboard'),
      },
      {
        key: '/users',
        icon: <UserOutlined />,
        label: t('admin.nav.users'),
      },
      {
        key: '/orders',
        icon: <ShoppingCartOutlined />,
        label: t('admin.nav.orders'),
      },
      {
        key: '/collections',
        icon: <AppstoreOutlined />,
        label: t('admin.nav.collections'),
      },
      {
        key: '/employees',
        icon: <UserOutlined />,
        label: t('admin.nav.managers'),
      },
      {
        key: '/products',
        icon: <ShoppingOutlined />,
        label: t('admin.nav.products'),
      },
      {
        key: '/vouchers',
        icon: <GiftOutlined />,
        label: t('admin.nav.vouchers'),
      },
    ],
    [t],
  );

  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key || '';

  return (
    <div className="border-r border-gray-200 fixed flex h-screen w-72 flex-col bg-white">
      <div className="text-xl font-semibold mt-4 ms-7">Admin</div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="min-h-0 flex-1 border-r-0 pt-2"
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
      </div>
    </div>
  );
};

export default SidebarMenu;
