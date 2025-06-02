import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import Notification from '../ui/Notification';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen, darkMode, notifications } = useAppSelector((state) => state.ui);
  const [mounted, setMounted] = useState(false);

  // Handle dark mode
  useEffect(() => {
    setMounted(true);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Don't render UI until we've determined if we're in dark mode
  if (!mounted) return null;

  return (
    <div className={`h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 md:p-6 ${
            sidebarOpen ? 'md:ml-64' : ''
          }`}
        >
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notification container */}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
          onClick={() => dispatch(toggleSidebar())}
        ></div>
      )}
    </div>
  );
};

export default Layout;