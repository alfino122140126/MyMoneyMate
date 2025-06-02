import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRecurringExpense, updateRecurringExpense } from '../../redux/recurringExpenseSlice'; // Adjust path

const RecurringExpenseForm = ({ expenseToEdit, setExpenseToEdit }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    frequency: 'monthly',
    next_due_date: '',
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        description: expenseToEdit.description,
        amount: expenseToEdit.amount,
        frequency: expenseToEdit.frequency,
        next_due_date: expenseToEdit.next_due_date, // Assuming date is in correct format
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        frequency: expenseToEdit?.frequency || 'monthly', // Use existing frequency if editing
        next_due_date: '',
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expenseToEdit) {
      dispatch(updateRecurringExpense({ id: expenseToEdit.id, ...formData }));
      setExpenseToEdit(null); // Clear form after editing
    } else {
      dispatch(addRecurringExpense(formData));
    }
    setFormData({
      description: '',
      amount: '',
      frequency: 'monthly',
      next_due_date: '',
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">{expenseToEdit ? 'Edit Recurring Expense' : 'Add Recurring Expense'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            name="frequency"
            id="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            {/* Add other frequencies as needed */}
          </select>
        </div>
        <div>
          <label htmlFor="next_due_date" className="block text-sm font-medium text-gray-700">Next Due Date</label>
          <input
            type="date"
            name="next_due_date"
            id="next_due_date"
            value={formData.next_due_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            {expenseToEdit ? 'Update Expense' : 'Add Expense'}
          </button>
          {expenseToEdit && (
            <button
              type="button"
              onClick={() => setExpenseToEdit(null)} // Changed to setExpenseToEdit(null) to clear the form
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecurringExpenseForm;