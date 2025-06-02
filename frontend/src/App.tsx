import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import LoginPage from './pages/LoginPage';

// Mock auth for demo purposes
const mockAuth = {
  user: {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
  },
  token: 'mock-token-123',
};

// Set mock auth in localStorage for demo
localStorage.setItem('token', mockAuth.token);
localStorage.setItem('user', JSON.stringify(mockAuth.user));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;