import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { NotFoundPage } from '../pages/NotFoundPage';
import CategoryPage from '../pages/CategoryPage';
import CartPage from '../pages/CartPage';
import CollectionPage from '../pages/CollectionPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import WishlistPage from '../pages/WishlistPage';
import AuthPage from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<AuthPage />} />
      <Route path="login" element={<Navigate to="/auth" replace />} />
      <Route path="register" element={<Navigate to="/auth" replace />} />
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="product/:productId" element={<ProductDetailPage />} />
        <Route path="collection/:collectionId" element={<CollectionPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export { AppRoutes };
