import { Outlet } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

const RootLayout = () => {
  return (
    <div className="flex">
      <SidebarMenu />
      <div className="ml-72 p-10 border-l border-gray-200 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
