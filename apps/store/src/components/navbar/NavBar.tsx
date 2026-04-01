import { Badge, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaRegHeart, FaRegUser } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { MdSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { mockCartItems } from './mockCart';
import { mockWishlist } from './mockWishlist';

const NavBar = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(next);
  };

  const cartCount = mockCartItems.reduce((sum, it) => sum + it.quantity, 0);
  const wishlistCount = mockWishlist.length;

  return (
    <div className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full items-center justify-between px-[200px] py-4">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="font-bold text-3xl mr-3
        "
        >
          {t('nav.store')}
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
        <FaRegUser className="cursor-pointer hover:font-semibold" />
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
          {i18n.language === 'en' ? 'VI' : 'EN'}
        </Button>
      </nav>
    </div>
  );
};

export default NavBar;
