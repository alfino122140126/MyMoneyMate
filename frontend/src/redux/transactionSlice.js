import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import api from '../api/axios'; // Import the configured axios instance
import axios from 'axios'; // Import the default axios instance to remove later
const initialState = {
  transactions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async() => {
    const response = await api.get('/api/transactions');
    return response.data;
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (newTransaction) => {
    const response = await api.post('/api/transactions', newTransaction);
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (updatedTransaction) => {
    const {
      id,
      ...rest
    } = updatedTransaction;
    const response = await api.put(`/api/transactions/${id}`, rest);
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async(transactionId) => {
    await api.delete(`/api/transactions/${transactionId}`);
    return transactionId; // Return the ID to remove from state
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Standard reducers if needed (e.g., for clearing state)
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      });
  },
});

export const selectAllTransactions = (state) => state.transactions.transactions;
export const selectTransactionById = (state, transactionId) =>
  state.transactions.transactions.find(
    (transaction) => transaction.id === transactionId
  );
export const getTransactionsStatus = (state) => state.transactions.status;
export const getTransactionsError = (state) => state.transactions.error;

export default transactionSlice.reducer;