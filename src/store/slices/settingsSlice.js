// Settings slice for Redux store
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveSettings, loadSettings } from '../../services/storage';

// Default initial state (async loading happens after store creation)
const initialState = {
  isDarkMode: false,
  searchQuery: '',
  filterStatus: 'all', // 'all', 'todo', 'inProgress', 'done'
  isLoading: false,
};

// Async thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await loadSettings();
      return settings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveSettingsAsync = createAsyncThunk(
  'settings/saveSettings',
  async (settings, { rejectWithValue }) => {
    try {
      await saveSettings(settings);
      return settings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Note: Storage saving is now handled via thunk
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      // Note: Storage saving is now handled via thunk
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.filterStatus = 'all';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isDarkMode = action.payload.isDarkMode || false;
        }
      })
      .addCase(fetchSettings.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Export actions
export const {
  toggleDarkMode,
  setDarkMode,
  setSearchQuery,
  clearSearchQuery,
  setFilterStatus,
  resetFilters,
} = settingsSlice.actions;

// Export selectors
export const selectIsDarkMode = (state) => state.settings.isDarkMode;
export const selectSearchQuery = (state) => state.settings.searchQuery;
export const selectFilterStatus = (state) => state.settings.filterStatus;

// Export reducer
export default settingsSlice.reducer;
