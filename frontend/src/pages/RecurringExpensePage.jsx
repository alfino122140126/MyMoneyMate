import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecurringExpenseList from '../components/recurringExpenses/RecurringExpenseList';
import RecurringExpenseForm from '../components/recurringExpenses/RecurringExpenseForm';
import { fetchRecurringExpenses } from '../redux/recurringExpenseSlice';

const RecurringExpensePage = () => {
  const dispatch = useDispatch();
  const recurringExpenses = useSelector((state) => state.recurringExpenses.recurringExpenses);
  const status = useSelector((state) => state.recurringExpenses.status);
  const error = useSelector((state) => state.recurringExpenses.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRecurringExpenses());
    }
  }, [status, dispatch]);

  return (
 <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8"> {/* Added closing tag */}
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recurring Expenses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-3">Add/Edit Recurring Expense</h2>
          <RecurringExpenseForm />
 </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Recurring Expense List</h2>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p className="text-red-500">Error: {error}</p>}
 {status === 'succeeded' && recurringExpenses.length > 0 && <RecurringExpenseList recurringExpenses={recurringExpenses} />} {/* Pass recurringExpenses prop */}
          {status === 'succeeded' && recurringExpenses.length === 0 && (
            <p>No recurring expenses found.</p>
          )}
        </div>
      </div>
    </div>
 );
};

export default RecurringExpensePage;