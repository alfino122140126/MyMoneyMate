import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDebts, deleteDebt } from '../../redux/debtSlice'; // Adjust the path

const DebtList = () => {
  const dispatch = useDispatch();
  const debts = useSelector((state) => state.debts.debts);
  const debtStatus = useSelector((state) => state.debts.status);
  const error = useSelector((state) => state.debts.error);

  useEffect(() => {
    if (debtStatus === 'idle') {
      dispatch(fetchDebts());
    }
  }, [debtStatus, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteDebt(id));
  };

  if (debtStatus === 'loading') {
    return <div className="text-center text-gray-600">Loading debts...</div>;
  }

  if (debtStatus === 'failed') {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Add check for party_name existence as it might be null initially or named differently
  const displayDebts = debts.map(debt => ({
    ...debt,
    party_name: debt.party_name || 'N/A', // Provide a default if party_name is null
    due_date: debt.due_date ? new Date(debt.due_date).toLocaleDateString() : 'N/A', // Format date
  }));

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Debt List</h2>
      {debts.length === 0 ? (
        <p className="text-gray-500">No debts recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayDebts.map((debt) => (
              <tr key={debt.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{debt.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${debt.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.party_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{debt.due_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  // onClick={() => handleEdit(debt.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(debt.id)}

                >
                  Delete
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default DebtList;