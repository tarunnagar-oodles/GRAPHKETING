// Projects slice for Redux store
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateId, getCurrentTimestamp } from '../../utils/helpers';
import { saveProjects, loadProjects } from '../../services/storage';
import { syncProjects } from '../../services/syncService';

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  isSyncing: false,
  error: null,
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = await loadProjects();
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveProjectsAsync = createAsyncThunk(
  'projects/saveProjects',
  async (projects, { rejectWithValue }) => {
    try {
      await saveProjects(projects);
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncProjectsAsync = createAsyncThunk(
  'projects/syncProjects',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { projects } = getState().projects;
      const result = await syncProjects(projects);
      if (result.success) {
        return result.data;
      }
      return rejectWithValue(result.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const newProject = {
        id: generateId(),
        title: action.payload.title,
        description: action.payload.description || '',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      state.projects.push(newProject);
      // Note: Storage saving is now handled via middleware or thunk
    },
    updateProject: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.projects.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.projects[index] = {
          ...state.projects[index],
          ...updates,
          updatedAt: getCurrentTimestamp(),
        };
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
    setCurrentProject: (state, action) => {
      state.currentProject = state.projects.find((p) => p.id === action.payload) || null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Sync projects
      .addCase(syncProjectsAsync.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncProjectsAsync.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncProjectsAsync.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  clearCurrentProject,
  setProjects,
} = projectsSlice.actions;

// Export selectors
export const selectProjects = (state) => state.projects.projects;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectById = (id) => (state) =>
  state.projects.projects.find((p) => p.id === id);
export const selectIsLoading = (state) => state.projects.isLoading;
export const selectIsSyncing = (state) => state.projects.isSyncing;

// Export reducer
export default projectsSlice.reducer;
