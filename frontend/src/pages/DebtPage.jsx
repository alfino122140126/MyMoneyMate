import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DebtList from '../components/debts/DebtList';
import DebtForm from '../components/debts/DebtForm';
import { fetchDebts } from '../redux/debtSlice';

function DebtPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDebts());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Debts</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <DebtForm />
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <DebtList />
      </div>
    </div>
  );
}

export default DebtPage;