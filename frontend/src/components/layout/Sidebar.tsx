import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  BarChart4, 
  Settings, 
  LogOut, 
  PlusCircle,
  Calendar
} from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const navigationItems = [
    { name: 'Beranda', icon: <Home size={20} />, path: '/' },
    { name: 'Transaksi', icon: <CreditCard size={20} />, path: '/transactions' },
    { name: 'Kategori', icon: <PieChart size={20} />, path: '/categories' },
    { name: 'Anggaran', icon: <BarChart4 size={20} />, path: '/budgets' },
    { name: 'Kalender', icon: <Calendar size={20} />, path: '/calendar' },
    { name: 'Pengaturan', icon: <Settings size={20} />, path: '/settings' },
  ];

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 md:translate-x-0 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Header sidebar */}
        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">MyMoneyMate</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola keuangan Anda</p>
        </div>

        {/* Profil pengguna */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.name.substring(0, 1).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Link navigasi */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Aksi cepat */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            className="w-full justify-center mb-2"
            leftIcon={<PlusCircle size={16} />}
          >
            Transaksi Baru
          </Button>
          <Button
            variant="outline"
            className="w-full justify-center text-red-500 hover:text-red-600"
            leftIcon={<LogOut size={16} />}
          >
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;