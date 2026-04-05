import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeManagementPage from '../pages/EmployeeManagement/EmployeeManagementPage';
import ProductManagementPage from '../pages/ProductManagement/ProductManagementPage';
import VoucherManagementPage from '../pages/VoucherManagement/VoucherManagementPage';
import CollectionManagementPage from '../pages/CollectionManagement/CollectionManagementPage';
import RootLayout from '../components/layout/RootLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import EmployeeForm from '../pages/EmployeeManagement/EmployeeForm';
import EmployeeDetailPage from '../pages/EmployeeManagement/EmployeeDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeManagementPage />} />
        <Route path="/employees/add-new" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/vouchers" element={<VoucherManagementPage />} />
        <Route path="/collections" element={<CollectionManagementPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
