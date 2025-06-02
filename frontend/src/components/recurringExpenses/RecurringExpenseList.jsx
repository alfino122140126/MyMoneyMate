import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchRecurringExpenses,
  deleteRecurringExpense,
  selectRecurringExpenses,
  selectRecurringExpenseLoading,
  selectRecurringExpenseError
} from '../../redux/recurringExpenseSlice'; // Adjust path as needed

const RecurringExpenseList = () => {
  const dispatch = useDispatch();
  const recurringExpenses = useSelector(selectRecurringExpenses);
  const loading = useSelector(selectRecurringExpenseLoading);
  const error = useSelector(selectRecurringExpenseError);

  useEffect(() => {
    dispatch(fetchRecurringExpenses());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading recurring expenses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (recurringExpenses.length === 0) {
    return <div className="text-center text-gray-600">No recurring expenses found.</div>;
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this recurring expense?')) {
      dispatch(deleteRecurringExpense(id));
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recurring Expenses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Frequency</th>
              <th className="py-3 px-6 text-left">Next Due</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {recurringExpenses.map((expense) => (
              <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="font-medium text-gray-800">{expense.description}</div>
                </td>
                <td className="py-3 px-6 text-left">
                  ${parseFloat(expense.amount).toFixed(2)} {/* Ensure amount is treated as number */}
                </td>
                <td className="py-3 px-6 text-left">
                  {expense.frequency}
                </td>
                <td className="py-3 px-6 text-left">
                  {expense.next_due_date ? new Date(expense.next_due_date).toLocaleDateString() : '-'}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button
                      onClick={() => console.log('Edit', expense.id)} // Replace with actual edit handler
                      className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110"
                      title="Edit"
                    >
                       {/* Basic Edit Icon placeholder - replace with SVG or actual icon */}
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="w-6 mr-2 transform hover:text-red-500 hover:scale-110"
                      title="Delete"
                    >
                       {/* Basic Delete Icon placeholder - replace with SVG or actual icon */}
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringExpenseList;