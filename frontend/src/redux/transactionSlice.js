import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import api from '../api/axios'; // Import the configured axios instance
const initialState = {
  transactions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/transactions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (newTransaction, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/transactions', newTransaction);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (updatedTransaction, { rejectWithValue }) => {
    const {
      id,
      ...rest
    } = updatedTransaction;
    try {
      const response = await api.put(`/api/transactions/${id}`, rest);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async(transactionId) => {
 try {
 await api.delete(`/api/transactions/${transactionId}`);
      return transactionId; // Return the ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
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
        state.error = action.payload; // Use action.payload from rejectWithValue
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
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.payload; // Handle error for adding
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.payload; // Handle error for updating
      });
    })
    .addCase(deleteTransaction.rejected, (state, action) => {
      state.error = action.payload; // Handle error for deleting
    });

export const selectAllTransactions = (state) => state.transactions.transactions;
export const selectTransactionById = (state, transactionId) =>
  state.transactions.transactions.find(
    (transaction) => transaction.id === transactionId
  );
export const getTransactionsStatus = (state) => state.transactions.status;
export const getTransactionsError = (state) => state.transactions.error;

export default transactionSlice.reducer;