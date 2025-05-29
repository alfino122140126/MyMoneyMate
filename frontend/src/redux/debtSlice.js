import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'; // Import configured axios instance

const initialState = {
  debts: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchDebts = createAsyncThunk('debts/fetchDebts', async (_, { rejectWithValue }) => {
  const response = await api.get('/api/debts');
  return response.data;
});

export const addDebt = createAsyncThunk('debts/addDebt', async (debtData, { rejectWithValue }) => {
  const response = await api.post('/api/debts', debtData);
  return response.data;
});

export const updateDebt = createAsyncThunk('debts/updateDebt', async (debtData, { rejectWithValue }) => {
  const response = await api.put(`/api/debts/${debtData.id}`, debtData);
  return response.data;
});

export const deleteDebt = createAsyncThunk('debts/deleteDebt', async (debtId, { rejectWithValue }) => {
  await api.delete(`/api/debts/${debtId}`);
  return debtId;
});

const debtSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    // Standard reducers if needed, though async thunks often handle state updates
  },
  extraReducers: (builder) => {
    builder
      // Fetch Debts
      .addCase(fetchDebts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.loading = false;
        state.debts = action.payload;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Debt
      .addCase(addDebt.fulfilled, (state, action) => {
        state.debts.push(action.payload);
      })
      .addCase(addDebt.rejected, (state, action) => {
         state.error = action.error.message; // Handle add error
      })
      // Update Debt
      .addCase(updateDebt.fulfilled, (state, action) => {
        const index = state.debts.findIndex(debt => debt.id === action.payload.id);
        if (index !== -1) {
          state.debts[index] = action.payload;
        }
      })
       .addCase(updateDebt.rejected, (state, action) => {
          state.error = action.error.message; // Handle update error
       })
      // Delete Debt
      .addCase(deleteDebt.fulfilled, (state, action) => {
        state.debts = state.debts.filter(debt => debt.id !== action.payload);
      })
       .addCase(deleteDebt.rejected, (state, action) => {
          state.error = action.error.message; // Handle delete error
       });
  },
});

export default debtSlice.reducer;

// Export any actions if you have standard reducers
// export const {  } = debtSlice.actions;