import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, updateTransaction } from '../../redux/transactionSlice';
import { fetchCategories } from '../../redux/categorySlice';

const TransactionForm = ({ transactionToEdit, setTransactionToEdit }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const categoryStatus = useSelector((state) => state.categories.status);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    type: 'expense', // default to expense
    category_id: null,
  });

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        description: transactionToEdit.description || '',
        amount: transactionToEdit.amount || '',
        date: transactionToEdit.date || '', // Assuming date is in a format suitable for input type="date"
        type: transactionToEdit.type || 'expense',
        category_id: transactionToEdit.category_id || null,
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        date: '',
        type: 'expense',
        category_id: null,
      });
    }
  }, [transactionToEdit]);

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount), // Ensure amount is a number
      category_id: formData.category_id ? parseInt(formData.category_id) : null, // Ensure category_id is an integer or null
    };

    if (transactionToEdit) {
      dispatch(updateTransaction({ id: transactionToEdit.id, data: transactionData }));
      setTransactionToEdit(null); // Clear form after update
    } else {
      dispatch(addTransaction(transactionData));
    }

    // Clear form after submission (for adding)
    if (!transactionToEdit) {
      setFormData({
        description: '',
        amount: '',
        date: '',
        type: 'expense',
        category_id: null,
      });
    }
  };

  return (
    <div className="mb-4 p-4 border rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
            step="0.01"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div> {/* Moved Category field below Amount and Date */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange} // Add required to category select? Maybe make required based on type?
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {transactionToEdit ? 'Update Transaction' : 'Add Transaction'}
          </button>
          {transactionToEdit && (
            <button
              type="button"
              onClick={() => setTransactionToEdit(null)}
              className="ml-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;