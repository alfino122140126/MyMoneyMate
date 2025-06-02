import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'; // Import the configured axios instance

const API_URL = '/api/categories'; // Sesuaikan dengan endpoint API backend

// Async Thunks for API interaction
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_URL); // Use the configured instance
  } catch (error) {
    // return error.message || 'Failed to fetch categories';
     // Better to return the error response for more details
    return rejectWithValue(error.response.data);
  }
});

export const addCategory = createAsyncThunk('categories/addCategory', async (newCategory, { rejectWithValue }) => {
  try {
    const response = await api.post(API_URL, newCategory); // Use the configured instance
  } catch (error) {
    // return error.message || 'Failed to add category';
     return rejectWithValue(error.response.data);
  }
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async (updatedCategory, { rejectWithValue }) => {
  try {
    const response = await api.put(`${API_URL}/${updatedCategory.id}`, updatedCategory); // Use the configured instance
  } catch (error) {
    // return error.message || 'Failed to update category';
     return rejectWithValue(error.response.data);
  }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (categoryId, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/${categoryId}`); // Use the configured instance
    return categoryId; // Return the ID of the deleted category
  } catch (error) {
    // return error.message || 'Failed to delete category';
     return rejectWithValue(error.response.data);
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Synchronous reducers if needed, e.g., for resetting state
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Category
      .addCase(addCategory.fulfilled, (state, action) => {
        // Assuming the backend returns the newly created category object
        state.categories.push(action.payload);
      })
       .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload; // Handle error for adding
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        // Assuming the backend returns the updated category object
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
       .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload; // Handle error for updating
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        // action.payload is the categoryId returned by the thunk
        state.categories = state.categories.filter(category => category.id !== action.payload);
      })
       .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload; // Handle error for deleting
      });
  },
});

// Export reducers and actions
// export const { someSynchronousAction } = categorySlice.actions; // Uncomment if you add synchronous reducers
export default categorySlice.reducer;