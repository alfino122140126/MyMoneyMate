import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/transactionSlice';
import { fetchCategories } from '../redux/categorySlice';
import { logout } from '../redux/authSlice'; // Import the logout action
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DashboardPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions.transactions);
  const categories = useSelector(state => state.categories.categories); // Fetch categories if needed for display/filtering

  const transactionStatus = useSelector(state => state.transactions.status);
  const transactionError = useSelector(state => state.transactions.error);

  const categoryStatus = useSelector(state => state.categories.status);
  const categoryError = useSelector(state => state.categories.error);


  useEffect(() => {
    if (transactionStatus === 'idle') {
      dispatch(fetchTransactions());
    }
    if (categoryStatus === 'idle') {
       dispatch(fetchCategories());
    }
  }, [transactionStatus, categoryStatus, dispatch]);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/auth'); // Redirect to the login page
  };

  // Calculate financial summaries
  const totalBalance = transactions.reduce((balance, transaction) => {
    if (transaction.type === 'income') { // Assuming \'amount\' is stored as a number or can be safely parsed
      return balance + parseFloat(transaction.amount);
    } else if (transaction.type === 'expense') {
      return balance - amount;
    }
    return balance;
  }, 0);

  if (transactionStatus === 'loading' || categoryStatus === 'loading') {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading Dashboard...</div>;
  }

  if (transactionError || categoryError) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error loading data: {transactionError || categoryError}</div>;
  }

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Balance</h2>
          <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {totalBalance.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Income</h2>
           <p className="text-3xl font-bold text-green-600">
             Rp {totalIncome.toLocaleString('id-ID')}
           </p>
        </div>

         {/* Total Expense Card */}
         <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Expense</h2>
            <p className="text-3xl font-bold text-red-600">
              Rp {transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0).toLocaleString('id-ID')}
           </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
      

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Financial Overview</h2>
        {/* Placeholder for Charts/Graphs */}
        <div className="text-gray-500 italic">
          Charts and graphs will be displayed here (e.g., expense by category, income vs expense over time).
          Integration with charting libraries (like Chart.js, Nivo, etc.) can be added here.
        </div>
        {/* Example: <ExpenseByCategoryChart data={transactions} categories={categories} /> */}
        {/* Example: <IncomeExpenseTrendChart data={transactions} /> */}
      </div>


    </div>
  );
};

export default DashboardPage;