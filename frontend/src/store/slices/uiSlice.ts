import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  selectedPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notifications: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }[];
}

const initialState: UIState = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  sidebarOpen: window.innerWidth > 768,
  selectedPeriod: 'monthly',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSelectedPeriod: (state, action: PayloadAction<'daily' | 'weekly' | 'monthly' | 'yearly'>) => {
      state.selectedPeriod = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  setSelectedPeriod,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;