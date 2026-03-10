import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* The Navbar stays permanently at the top */}
      <Navbar />
      
      {/* The Outlet is where React Router swaps out your page content */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};