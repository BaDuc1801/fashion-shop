import { Outlet } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import Footer from './Footer';

export function RootLayout() {
  return (
    <div className="min-h-dvh text-slate-900">
      <header className="relative border-b border-slate-200 min-h-[80px]">
        <NavBar />
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
