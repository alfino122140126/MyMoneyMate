import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ redirectPath = '/auth' }) => {
  const { token } = useSelector((state) => state.auth); // Get token from Redux state

  // You might also want to check localStorage for a token on initial load
  const localToken = localStorage.getItem('token');

  if (!token && !localToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;