// Fake API sync service - simulates server communication
import { saveLastSync } from './storage';

/**
 * Simulate server sync - No actual network calls
 * This mimics what a real API call would do
 */
export const fakeSyncServer = async (localData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      saveLastSync();
      resolve(localData);
    }, 1500);
  });
};

/**
 * Sync projects with fake server
 */
export const syncProjects = async (projects) => {
  try {
    console.log('Syncing projects with server...');
    const syncedData = await fakeSyncServer(projects);
    console.log('Projects synced successfully');
    return { success: true, data: syncedData };
  } catch (error) {
    console.error('Error syncing projects:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync tasks with fake server
 */
export const syncTasks = async (tasks) => {
  try {
    console.log('Syncing tasks with server...');
    const syncedData = await fakeSyncServer(tasks);
    console.log('Tasks synced successfully');
    return { success: true, data: syncedData };
  } catch (error) {
    console.error('Error syncing tasks:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync all data with fake server
 */
export const syncAllData = async (data) => {
  try {
    console.log('Syncing all data with server...');
    const syncedData = await fakeSyncServer(data);
    console.log('All data synced successfully');
    return { success: true, data: syncedData };
  } catch (error) {
    console.error('Error syncing all data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync on app open
 */
export const syncOnAppOpen = async (projects, tasks) => {
  return syncAllData({ projects, tasks });
};

/**
 * Sync on project switch
 */
export const syncOnProjectSwitch = async (projectId, tasks) => {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  return syncTasks(projectTasks);
};

/**
 * Sync on task update
 */
export const syncOnTaskUpdate = async (task) => {
  return fakeSyncServer(task);
};

export default {
  fakeSyncServer,
  syncProjects,
  syncTasks,
  syncAllData,
  syncOnAppOpen,
  syncOnProjectSwitch,
  syncOnTaskUpdate,
};
