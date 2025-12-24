// Custom hook for task operations
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setCurrentTask,
  clearCurrentTask,
  fetchTasks,
  saveTasksAsync,
  syncTasksAsync,
  syncSingleTask,
  selectTasks,
  selectCurrentTask,
  selectIsTasksLoading,
  selectIsTasksSyncing,
} from '../store/slices/tasksSlice';
import { syncOnProjectSwitch } from '../services/syncService';

const useTasks = (projectId = null) => {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectTasks);
  const currentTask = useSelector(selectCurrentTask);
  const isLoading = useSelector(selectIsTasksLoading);
  const isSyncing = useSelector(selectIsTasksSyncing);

  // Filter tasks by project if projectId is provided
  const tasks = useMemo(() => {
    if (projectId) {
      return allTasks.filter((t) => t.projectId === projectId);
    }
    return allTasks;
  }, [allTasks, projectId]);

  // Group tasks by status for Kanban board
  const tasksByStatus = useMemo(() => {
    const grouped = {
      todo: [],
      inProgress: [],
      done: [],
    };
    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const loadTasks = useCallback(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const createTask = useCallback(
    (taskData) => {
      dispatch(addTask(taskData));
      // Save tasks to storage after adding
      setTimeout(() => {
        const currentTasks = [...allTasks, taskData];
        dispatch(saveTasksAsync(currentTasks));
      }, 100);
    },
    [dispatch, allTasks]
  );

  const editTask = useCallback(
    (id, updates) => {
      dispatch(updateTask({ id, ...updates }));
      dispatch(syncSingleTask(id));
      // Save tasks to storage after updating
      setTimeout(() => {
        const updatedTasks = allTasks.map(t => t.id === id ? { ...t, ...updates } : t);
        dispatch(saveTasksAsync(updatedTasks));
      }, 100);
    },
    [dispatch, allTasks]
  );

  const removeTask = useCallback(
    (id) => {
      dispatch(deleteTask(id));
      // Save tasks to storage after deleting
      setTimeout(() => {
        const filteredTasks = allTasks.filter(t => t.id !== id);
        dispatch(saveTasksAsync(filteredTasks));
      }, 100);
    },
    [dispatch, allTasks]
  );

  const changeTaskStatus = useCallback(
    (taskId, newStatus) => {
      dispatch(moveTask({ taskId, newStatus }));
      dispatch(syncSingleTask(taskId));
      // Save tasks to storage after moving
      setTimeout(() => {
        const updatedTasks = allTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        dispatch(saveTasksAsync(updatedTasks));
      }, 100);
    },
    [dispatch, allTasks]
  );

  const selectTaskById = useCallback(
    (id) => {
      dispatch(setCurrentTask(id));
    },
    [dispatch]
  );

  const deselectTask = useCallback(() => {
    dispatch(clearCurrentTask());
  }, [dispatch]);

  const syncTasks = useCallback(() => {
    dispatch(syncTasksAsync());
  }, [dispatch]);

  const syncProjectTasks = useCallback(
    async (pid) => {
      await syncOnProjectSwitch(pid, allTasks);
    },
    [allTasks]
  );

  return {
    tasks,
    tasksByStatus,
    currentTask,
    isLoading,
    isSyncing,
    loadTasks,
    createTask,
    editTask,
    removeTask,
    changeTaskStatus,
    selectTaskById,
    deselectTask,
    syncTasks,
    syncProjectTasks,
  };
};

export default useTasks;
