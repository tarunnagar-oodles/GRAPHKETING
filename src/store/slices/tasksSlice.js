// Tasks slice for Redux store
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateId, getCurrentTimestamp } from '../../utils/helpers';
import { saveTasks, loadTasks } from '../../services/storage';
import { syncTasks, syncOnTaskUpdate } from '../../services/syncService';

// Initial state
const initialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  isSyncing: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await loadTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTasksAsync = createAsyncThunk(
  'tasks/saveTasks',
  async (tasks, { rejectWithValue }) => {
    try {
      await saveTasks(tasks);
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncTasksAsync = createAsyncThunk(
  'tasks/syncTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { tasks } = getState().tasks;
      const result = await syncTasks(tasks);
      if (result.success) {
        return result.data;
      }
      return rejectWithValue(result.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncSingleTask = createAsyncThunk(
  'tasks/syncSingleTask',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const { tasks } = getState().tasks;
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await syncOnTaskUpdate(task);
        return task;
      }
      return rejectWithValue('Task not found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: generateId(),
        projectId: action.payload.projectId,
        title: action.payload.title,
        description: action.payload.description || '',
        status: action.payload.status || 'todo',
        dueDate: action.payload.dueDate || getCurrentTimestamp(),
        assignedUser: action.payload.assignedUser || '',
        estimatedHours: action.payload.estimatedHours || 0,
        imageUri: action.payload.imageUri || null,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      state.tasks.push(newTask);
      // Note: Storage saving is now handled via middleware or thunk
    },
    updateTask: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...updates,
          updatedAt: getCurrentTimestamp(),
        };
        
        // Update currentTask if it's the one being updated
        if (state.currentTask?.id === id) {
          state.currentTask = state.tasks[index];
        }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null;
      }
    },
    moveTask: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          status: newStatus,
          updatedAt: getCurrentTimestamp(),
        };
      }
    },
    setCurrentTask: (state, action) => {
      state.currentTask = state.tasks.find((t) => t.id === action.payload) || null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    deleteTasksByProject: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.projectId !== action.payload);
      // Note: Storage saving is now handled via middleware or thunk
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Save tasks
      .addCase(saveTasksAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Sync tasks
      .addCase(syncTasksAsync.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncTasksAsync.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncTasksAsync.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload;
      })
      // Sync single task
      .addCase(syncSingleTask.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncSingleTask.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncSingleTask.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setCurrentTask,
  clearCurrentTask,
  setTasks,
  deleteTasksByProject,
} = tasksSlice.actions;

// Export selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTaskById = (id) => (state) =>
  state.tasks.tasks.find((t) => t.id === id);
export const selectTasksByProject = (projectId) => (state) =>
  state.tasks.tasks.filter((t) => t.projectId === projectId);
export const selectTasksByStatus = (projectId, status) => (state) =>
  state.tasks.tasks.filter((t) => t.projectId === projectId && t.status === status);
export const selectIsTasksLoading = (state) => state.tasks.isLoading;
export const selectIsTasksSyncing = (state) => state.tasks.isSyncing;

// Export reducer
export default tasksSlice.reducer;
