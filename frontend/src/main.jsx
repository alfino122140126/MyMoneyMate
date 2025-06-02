import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import App from './App.jsx'; // Keep App if you still use it, otherwise remove
import { Provider } from 'react-redux';
import store from './redux/store.js';
import CategoryPage from './pages/CategoryPage.jsx';
import TransactionPage from './pages/TransactionPage.jsx';
import DebtPage from './pages/DebtPage.jsx';
import RecurringExpensePage from './pages/RecurringExpensePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import { useSelector } from 'react-redux'; // Import useSelector

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public route for Authentication */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Root route - redirects based on authentication status */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/debts" element={<DebtPage />} />
            <Route path="/recurring-expenses" element={<RecurringExpensePage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
)

// Helper component for Root redirection
function RootRedirect() {
  const isAuthenticated = useSelector(state => state.auth.token !== null); // Check if token exists in Redux state

  // Redirect based on authentication status
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />;
}