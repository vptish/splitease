import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Mesh gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-black dark:to-slate-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-20 dark:opacity-10 -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-20 dark:opacity-10 -z-10" />
      </div>

      {/* Main content */}
      <main className="relative z-0 pb-20 md:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom navigation - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
