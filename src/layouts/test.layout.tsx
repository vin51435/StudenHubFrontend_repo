// src/layouts/DefaultLayout.tsx
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Add Header, Sidebar, etc here */}
      <main className="flex-1 overflow-y-auto">
        testlayout
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
