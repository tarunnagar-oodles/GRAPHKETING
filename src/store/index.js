// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import { projectsReducer, tasksReducer, settingsReducer } from './slices';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
