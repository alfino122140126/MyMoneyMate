import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTransactions,
  deleteTransaction,
  selectAllTransactions,
} from '../../redux/transactionSlice';
import { fetchCategories, selectAllCategories } from '../../redux/categorySlice';

function TransactionList() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectAllTransactions);
  const categories = useSelector(selectAllCategories);
  const transactionStatus = useSelector((state) => state.transactions.status);
  const error = useSelector((state) => state.transactions.error);

  useEffect(() => {
    if (transactionStatus === 'idle') {
      dispatch(fetchTransactions()); // Fetch transactions on mount if idle
    }
    dispatch(fetchCategories()); // Always fetch categories as they are needed for display
  }, [transactionStatus, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (transactionStatus === 'loading') {
    return <div className="text-center text-gray-500">Loading transactions...</div>;
  }

  if (transactionStatus === 'failed') {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {transactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(transaction.category_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {/* TODO: Implement Edit Functionality */}}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
 </button>
                    <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-8">No transactions found.</div>
        )}
      </div>
    </div>
  );
}

export default TransactionList;