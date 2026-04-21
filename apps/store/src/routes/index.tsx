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
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import PaymentProcessingPage from '../pages/PaymentPage/PaymentProcessingPage';
import PaymentSuccessPage from '../pages/PaymentPage/PaymentSuccessPage';
import PaymentFailedPage from '../pages/PaymentPage/PaymentFailedPage';
import UserOrderPage from '../pages/UserAccountPage/UserOrderPage';
import OrderSuccessPage from '../pages/PaymentPage/OrderSuccessPage';
import QrBankPage from '../pages/PaymentPage/QrBankPage';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="auth" element={<AuthPage />} />
      <Route path="login" element={<Navigate to="/auth" replace />} />
      <Route path="register" element={<Navigate to="/auth" replace />} />
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <UserAccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="category" element={<CategoryPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="products/:sku" element={<ProductDetailPage />} />
        <Route path="payment/sepay" element={<QrBankPage />} />
        <Route path="collection/:collectionId" element={<CollectionPage />} />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="payment/processing" element={<PaymentProcessingPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route
          path="payment/failed"
          element={
            <ProtectedRoute>
              <PaymentFailedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-success"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/orders"
          element={
            <ProtectedRoute>
              <UserOrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export { AppRoutes };
