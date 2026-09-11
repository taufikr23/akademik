import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DoorTransition from './DoorTransition';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <DoorTransition />
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
