import { useMutation } from '@tanstack/react-query';
import { Badge, Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegHeart } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { MdSearch } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { getApiErrorMessage, useAuthStore, userService } from '@shared';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { mockCartItems } from './mockCart';
import { mockWishlist } from './mockWishlist';

const NavBar = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { token, user, clearSession } = useAuthStore(
    useShallow((s) => ({
      token: s.token,
      user: s.user,
      clearSession: s.clearSession,
    })),
  );

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(next);
  };

  const cartCount = mockCartItems.reduce((sum, it) => sum + it.quantity, 0);
  const wishlistCount = mockWishlist.length;
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  const isLoggedIn = Boolean(token && user);
  const avatar = user?.avatar;

  const changePasswordMutation = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(payload),
  });

  const resetChangePasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordError('');
  };

  const handleCloseChangePassword = () => {
    if (changePasswordMutation.isPending) return;
    setIsChangePasswordOpen(false);
    resetChangePasswordForm();
  };

  const handleSubmitChangePassword = async () => {
    if (changePasswordMutation.isPending) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError(t('auth.requiredChangePasswordFields'));
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordError(t('auth.passwordMinLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError(t('auth.passwordMismatch'));
      return;
    }
    setChangePasswordError('');
    try {
      const data = await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      message.success(data.message || t('auth.changePasswordSuccess'));
      clearSession();
      setIsChangePasswordOpen(false);
      resetChangePasswordForm();
      navigate('/auth');
    } catch (err: unknown) {
      setChangePasswordError(
        getApiErrorMessage(err, t('auth.changePasswordFailed')),
      );
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'my-account',
      label: t('auth.myAccount'),
      onClick: () => {
        navigate('/account');
      },
    },
    {
      key: 'change-password',
      label: t('auth.changePassword'),
      onClick: () => {
        setIsChangePasswordOpen(true);
        setChangePasswordError('');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: t('auth.logout'),
      onClick: () => {
        clearSession();
        navigate('/auth');
      },
    },
  ];

  return (
    <div className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full items-center justify-between px-[200px] py-4">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="font-bold text-3xl mr-3
        "
        >
          MonoChic
        </Link>
        <Link to="/" className="text-base font-medium hover:font-semibold">
          {t('nav.men')}
        </Link>
        <Link to="/" className="text-base font-medium hover:font-semibold">
          {t('nav.women')}
        </Link>
        <Link to="/" className="text-base font-medium hover:font-semibold">
          {t('nav.newArrivals')}
        </Link>
        <Link to="/" className="text-base font-medium hover:font-semibold">
          {t('nav.sale')}
        </Link>
      </div>
      <nav className="flex items-center gap-6 text-2xl font-medium">
        <MdSearch className="text-3xl cursor-pointer hover:font-semibold" />
        {/* <Link to="/account" className="leading-none">
          <FaRegUser className="cursor-pointer hover:font-semibold" />
        </Link> */}
        <Link to="/wishlist" className="leading-none">
          <Badge count={wishlistCount} size="small" offset={[0, 2]}>
            <FaRegHeart className="text-2xl cursor-pointer hover:font-semibold" />
          </Badge>
        </Link>
        <Link to="/cart" className="leading-none">
          <Badge count={cartCount} size="small" offset={[0, 2]}>
            <FiShoppingCart className="text-2xl cursor-pointer hover:font-semibold" />
          </Badge>
        </Link>

        <Button size="small" onClick={toggleLanguage}>
          {i18n.language === 'en' ? 'EN' : 'VI'}
        </Button>
        {isLoggedIn ? (
          <>
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['hover']}
              placement="bottomRight"
            >
              <img
                src={avatar}
                alt="avatar"
                className="size-12 rounded-full cursor-pointer"
              />
            </Dropdown>
            <ChangePasswordModal
              open={isChangePasswordOpen}
              loading={changePasswordMutation.isPending}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              error={changePasswordError}
              onCurrentPasswordChange={setCurrentPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onCancel={handleCloseChangePassword}
              onSubmit={handleSubmitChangePassword}
            />
          </>
        ) : (
          <Button
            size="large"
            type="primary"
            className="px-5"
            onClick={() => navigate('/auth')}
          >
            {t('auth.login')}
          </Button>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
