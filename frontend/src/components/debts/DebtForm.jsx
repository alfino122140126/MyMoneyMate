import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDebt, updateDebt } from '../../redux/debtSlice'; // Adjust path as needed

const DebtForm = ({ debtToEdit, setDebtToEdit }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'owed_to_you', // Default type
    party: '', // Person or party involved
    dueDate: '',
  });

  useEffect(() => {
    if (debtToEdit) {
      setFormData({
        description: debtToEdit.description || '',
        amount: debtToEdit.amount || '',
        type: debtToEdit.type || 'owed_to_you',
        party: debtToEdit.party || '',
        dueDate: debtToEdit.dueDate ? new Date(debtToEdit.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'owed_to_you',
        party: '',
        dueDate: '',
      });
    }
  }, [debtToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const debtData = {
      ...formData,
      amount: parseFloat(formData.amount), // Ensure amount is a number
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null, // Format date
    };

    if (debtToEdit) {
      dispatch(updateDebt({ id: debtToEdit.id, updatedDebt: debtData }));
      setDebtToEdit(null); // Clear form after update
    } else {
      dispatch(addDebt(debtData));
    }

    // Clear form
    setFormData({
      description: '',
      amount: '',
      type: 'owed_to_you',
      party: '',
      dueDate: '',
    });
  };

 return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">{debtToEdit ? 'Edit Debt' : 'Add New Debt'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            min="0"
            step="0.01"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="owed_to_you">Owed To You</option>
            <option value="you_owe">You Owe</option>
          </select>
        </div>
        <div>
          <label htmlFor="party" className="block text-sm font-medium text-gray-700">Party (Person/Company)</label>
          <input
            type="text"
            name="party"
            id="party"
            value={formData.party}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
 >
          {debtToEdit ? 'Update Debt' : 'Add Debt'}
        </button>
        {debtToEdit && (
          <button
            type="button"
            onClick={() => setDebtToEdit(null)}
            className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default DebtForm;