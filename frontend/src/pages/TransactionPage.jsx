import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import { fetchTransactions } from '../redux/transactionSlice';
import { fetchCategories } from '../redux/categorySlice';

const TransactionPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Transactions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add/Edit Transaction</h2>
          <TransactionForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Transaction List</h2>
          <TransactionList />
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;