import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Budget } from '../../types';
import api from '../../services/api';

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  isLoading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk('budgets/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/budgets');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch budgets');
  }
});

export const addBudget = createAsyncThunk(
  'budgets/add',
  async (budget: Omit<Budget, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/budgets', budget);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/update',
  async (budget: Budget, { rejectWithValue }) => {
    try {
      const response = await api.put(`/budgets/${budget.id}`, budget);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/budgets/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete budget');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.isLoading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<string>) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;