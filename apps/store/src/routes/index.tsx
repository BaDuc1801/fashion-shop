import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { NotFoundPage } from '../pages/NotFoundPage';
import CategoryPage from '../pages/CategoryPage';
import CartPage from '../pages/CartPage/CartPage';
import CollectionPage from '../pages/CollectionPage';
import ProductDetailPage from '../pages/ProductDetailPage/ProductDetailPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import { HomePage } from '../pages/HomePage';
import UserAccountPage from '../pages/UserAccountPage/UserAccountPage';
import WishlistPage from '../pages/WishListPage/WishlistPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<AuthPage />} />
      <Route path="login" element={<Navigate to="/auth" replace />} />
      <Route path="register" element={<Navigate to="/auth" replace />} />
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="account" element={<UserAccountPage />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:sku" element={<ProductDetailPage />} />
        <Route path="collection/:collectionId" element={<CollectionPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export { AppRoutes };
