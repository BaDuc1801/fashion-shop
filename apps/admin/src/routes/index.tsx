import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import EmployeeManagementPage from '../pages/EmployeeManagement/EmployeeManagementPage';
import ProductManagementPage from '../pages/ProductManagement/ProductManagementPage';
import VoucherManagementPage from '../pages/VoucherManagement/VoucherManagementPage';
import RootLayout from '../components/layout/RootLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import EmployeeAddPage from '../pages/EmployeeManagement/EmployeeAddPage';
import EmployeeDetailPage from '../pages/EmployeeManagement/EmployeeDetailPage';
import UserManagementPage from '../pages/UserManagement/UserManagementPage';
import UserAddPage from '../pages/UserManagement/UserAddPage';
import UserDetailPage from '../pages/UserManagement/UserDetailPage';
import ProductAddPage from '../pages/ProductManagement/ProductAddPage';
import ProductDetailPage from '../pages/ProductManagement/ProductDetailPage';
import VoucherAddPage from '../pages/VoucherManagement/VoucherAddPage';
import VoucherDetailPage from '../pages/VoucherManagement/VoucherDetailPage';
import OrderManagementPage from '../pages/OrderManagement/OrderManagementPage';
import OrderDetailPage from '../pages/OrderManagement/OrderDetailPage';
import CategoryManagementPage from '../pages/CategoryManagement/CategoryManagementPage';
import CategoryAddPage from '../pages/CategoryManagement/CategoryAddPage';
import CategoryDetailPage from '../pages/CategoryManagement/CategoryDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RootLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeManagementPage />} />
        <Route path="/employees/add-new" element={<EmployeeAddPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/users/add-new" element={<UserAddPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/products/add-new" element={<ProductAddPage />} />
        <Route path="/products/:sku" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        <Route path="/categories/add-new" element={<CategoryAddPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
        <Route path="/vouchers" element={<VoucherManagementPage />} />
        <Route path="/vouchers/add-new" element={<VoucherAddPage />} />
        <Route path="/vouchers/:id" element={<VoucherDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
