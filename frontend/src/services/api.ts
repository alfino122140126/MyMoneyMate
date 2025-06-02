import axios from 'axios';

// Buat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: '', // Ganti dengan endpoint API yang sebenarnya
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor request untuk menambahkan token auth ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor response untuk menangani error umum
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized, hapus token dan arahkan ke halaman login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Mock API untuk pengembangan (hapus di production)
export const mockApi = {
  // Hanya untuk keperluan demo/pengembangan
  getCategories: () => {
    return Promise.resolve([
      { id: '1', name: 'Makanan', icon: 'utensils', color: '#FF6B6B', type: 'expense' },
      { id: '2', name: 'Transportasi', icon: 'car', color: '#4ECDC4', type: 'expense' },
      { id: '3', name: 'Belanja', icon: 'shopping-bag', color: '#F9DC5C', type: 'expense' },
      { id: '4', name: 'Tagihan', icon: 'file-text', color: '#C8553D', type: 'expense' },
      { id: '5', name: 'Hiburan', icon: 'film', color: '#9D65C9', type: 'expense' },
      { id: '6', name: 'Gaji', icon: 'briefcase', color: '#4CB944', type: 'income' },
      { id: '7', name: 'Investasi', icon: 'trending-up', color: '#1982C4', type: 'income' },
      { id: '8', name: 'Hadiah', icon: 'gift', color: '#FF9F1C', type: 'income' },
    ]);
  },
  getTransactions: () => {
    return Promise.resolve([
      {
        id: '1',
        amount: 25000,
        date: '2023-06-01',
        description: 'Makan siang di restoran',
        categoryId: '1',
        type: 'expense',
        userId: 'user123',
      },
      {
        id: '2',
        amount: 35000,
        date: '2023-06-02',
        description: 'Perjalanan Gojek',
        categoryId: '2',
        type: 'expense',
        userId: 'user123',
      },
      {
        id: '3',
        amount: 5000000,
        date: '2023-06-03',
        description: 'Gaji bulanan',
        categoryId: '6',
        type: 'income',
        userId: 'user123',
      },
      {
        id: '4',
        amount: 120750,
        date: '2023-06-05',
        description: 'Belanja bulanan',
        categoryId: '3',
        type: 'expense',
        userId: 'user123',
      },
      {
        id: '5',
        amount: 200000,
        date: '2023-06-10',
        description: 'Tagihan listrik',
        categoryId: '4',
        type: 'expense',
        userId: 'user123',
      },
    ]);
  },
  getBudgets: () => {
    return Promise.resolve([
      { id: '1', categoryId: '1', amount: 1000000, period: 'monthly', userId: 'user123' },
      { id: '2', categoryId: '2', amount: 500000, period: 'monthly', userId: 'user123' },
      { id: '3', categoryId: '3', amount: 750000, period: 'monthly', userId: 'user123' },
      { id: '4', categoryId: '4', amount: 1500000, period: 'monthly', userId: 'user123' },
    ]);
  },
};