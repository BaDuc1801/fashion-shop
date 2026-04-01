import { Outlet } from 'react-router-dom';
import NavBar from '../navbar/NavBar';

export function RootLayout() {
  return (
    <div className="min-h-dvh text-slate-900">
      <header className="relative border-b border-slate-200 min-h-[72px]">
        <NavBar />
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-slate-600">
          © {new Date().getFullYear()} Store
        </div>
      </footer>
    </div>
  );
}
