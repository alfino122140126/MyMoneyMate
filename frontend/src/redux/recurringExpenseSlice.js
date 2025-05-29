import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'; // Assuming you have an axios instance configured

const initialState = {
  recurringExpenses: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunks for interacting with the API
export const fetchRecurringExpenses = createAsyncThunk(
  'recurringExpenses/fetchRecurringExpenses',
  async () => {
    const response = await api.get('/api/recurring-expenses');
    return response.data;
  }
);

export const addRecurringExpense = createAsyncThunk(
  'recurringExpenses/addRecurringExpense',
  async (newExpense, { rejectWithValue }) => {
    const response = await api.post('/api/recurring-expenses', newExpense);
    return response.data;
  }
);

export const updateRecurringExpense = createAsyncThunk(
  'recurringExpenses/updateRecurringExpense',
  async (updatedExpense, { rejectWithValue }) => {
    const response = await api.put(`/api/recurring-expenses/${updatedExpense.id}`, updatedExpense);
    return response.data;
  }
);

export const deleteRecurringExpense = createAsyncThunk(
  'recurringExpenses/deleteRecurringExpense',
  async (expenseId, { rejectWithValue }) => {
    await api.delete(`/api/recurring-expenses/${expenseId}`);
    return expenseId; // Return the deleted ID
  }
);

const recurringExpenseSlice = createSlice({
  name: 'recurringExpenses',
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recurring Expenses
      .addCase(fetchRecurringExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecurringExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recurringExpenses = action.payload;
      })
      .addCase(fetchRecurringExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Recurring Expense
      .addCase(addRecurringExpense.fulfilled, (state, action) => {
        state.recurringExpenses.push(action.payload);
      })
      // Update Recurring Expense
      .addCase(updateRecurringExpense.fulfilled, (state, action) => {
        const index = state.recurringExpenses.findIndex(
          (exp) => exp.id === action.payload.id
        );
        if (index !== -1) {
          state.recurringExpenses[index] = action.payload;
        }
      })
      // Delete Recurring Expense
      .addCase(deleteRecurringExpense.fulfilled, (state, action) => {
        state.recurringExpenses = state.recurringExpenses.filter(
          (exp) => exp.id !== action.payload
        );
      });
  },
});

export const { } = recurringExpenseSlice.actions; // Export synchronous actions if any

export default recurringExpenseSlice.reducer;