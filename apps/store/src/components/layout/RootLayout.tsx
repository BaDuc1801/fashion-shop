import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import NavBar from '../navbar/NavBar';
import Footer from './Footer';

export function RootLayout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
