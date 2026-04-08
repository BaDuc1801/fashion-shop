import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeManagementPage from '../pages/EmployeeManagement/EmployeeManagementPage';
import ProductManagementPage from '../pages/ProductManagement/ProductManagementPage';
import VoucherManagementPage from '../pages/VoucherManagement/VoucherManagementPage';
import CollectionManagementPage from '../pages/CollectionManagement/CollectionManagementPage';
import RootLayout from '../components/layout/RootLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import EmployeeForm from '../pages/EmployeeManagement/EmployeeForm';
import EmployeeDetailPage from '../pages/EmployeeManagement/EmployeeDetailPage';
import UserManagementPage from '../pages/UserManagement/UserManagementPage';
import UserForm from '../pages/UserManagement/UserForm';
import UserDetailPage from '../pages/UserManagement/UserDetailPage';
import ProductForm from '../pages/ProductManagement/ProductForm';
import ProductDetailPage from '../pages/ProductManagement/ProductDetailPage';
import VoucherForm from '../pages/VoucherManagement/VoucherForm';
import VoucherDetailPage from '../pages/VoucherManagement/VoucherDetailPage';
import CollectionForm from '../pages/CollectionManagement/CollectionForm';
import CollectionDetailPage from '../pages/CollectionManagement/CollectionDetailPage';
import OrderManagementPage from '../pages/OrderManagement/OrderManagementPage';
import OrderDetailPage from '../pages/OrderManagement/OrderDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeManagementPage />} />
        <Route path="/employees/add-new" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/users/add-new" element={<UserForm />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/products/add-new" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/vouchers" element={<VoucherManagementPage />} />
        <Route path="/vouchers/add-new" element={<VoucherForm />} />
        <Route path="/vouchers/:id" element={<VoucherDetailPage />} />
        <Route path="/collections" element={<CollectionManagementPage />} />
        <Route path="/collections/add-new" element={<CollectionForm />} />
        <Route path="/collections/:id" element={<CollectionDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
