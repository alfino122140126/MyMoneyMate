import React from 'react';
import { Menu, Bell, Sun, Moon, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleDarkMode, toggleSidebar } from '../../store/slices/uiSlice';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.ui);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2 rounded-md"
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {/* Tombol Tambah Transaksi (terlihat di layar besar) */}
            <div className="hidden md:block">
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                leftIcon={<Plus size={16} />}
              >
                Tambah Transaksi
              </Button>
            </div>
            
            {/* Notifikasi */}
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none p-2 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Toggle mode gelap */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none p-2"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;