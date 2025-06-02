import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios'; // Import the configured Axios instance

// Define the initial state for the auth slice
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null, // Get token from local storage on initialization
  loading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials); // Use the configured instance
      const { user, token } = response.data;
      localStorage.setItem('token', token); // Store token in local storage
      return { user, token };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', userData); // Use the configured instance
      // Registration might not return a token immediately, adjust based on your API
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to manually set user and token (useful for initial load from local storage)
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Reducer for user logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from local storage
      delete axios.defaults.headers.common['Authorization']; // Remove default auth header
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loginUser pending state
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle loginUser fulfilled state
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      // Handle loginUser rejected state
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      })
      // Handle registerUser pending state
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle registerUser fulfilled state
      .addCase(registerUser.fulfilled, (state) => {
        state.error = null;
        // Depending on API, you might set user/token here or require manual login after registration
      })
      // Handle registerUser rejected state
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

// Export the actions and reducer
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;