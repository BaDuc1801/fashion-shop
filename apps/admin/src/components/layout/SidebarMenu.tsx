import { Menu } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingOutlined,
  GiftOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import { useNavigate, useLocation } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/collections',
      icon: <AppstoreOutlined />,
      label: 'Collection',
    },
    {
      key: '/employees',
      icon: <UserOutlined />,
      label: 'Manager',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Product',
    },
    {
      key: '/vouchers',
      icon: <GiftOutlined />,
      label: 'Voucher',
    },
  ];

  const selectedKey =
    items.find((item) => location.pathname.startsWith(item.key))?.key || '';

  return (
    <div className="w-72 fixed">
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
        items={items}
        onClick={(item) => {
          navigate(item.key);
        }}
      />
    </div>
  );
};

export default SidebarMenu;
