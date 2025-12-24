// Storage service using AsyncStorage for offline persistence (Expo Go compatible)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  PROJECTS: '@pm_projects',
  TASKS: '@pm_tasks',
  SETTINGS: '@pm_settings',
  LAST_SYNC: '@pm_lastSync',
};

/**
 * Save projects to storage
 */
export const saveProjects = async (projects) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

/**
 * Load projects from storage
 */
export const loadProjects = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

/**
 * Save tasks to storage
 */
export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

/**
 * Load tasks from storage
 */
export const loadTasks = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

/**
 * Save settings to storage
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Load settings from storage
 */
export const loadSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { isDarkMode: false };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { isDarkMode: false };
  }
};

/**
 * Save last sync timestamp
 */
export const saveLastSync = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    return true;
  } catch (error) {
    console.error('Error saving last sync:', error);
    return false;
  }
};

/**
 * Get last sync timestamp
 */
export const getLastSync = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error('Error getting last sync:', error);
    return null;
  }
};

/**
 * Clear all storage
 */
export const clearAllStorage = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Get storage info
 */
export const getStorageInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }
    return {
      keys: keys.length,
      size: totalSize,
      sizeFormatted: `${(totalSize / 1024).toFixed(2)} KB`,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { keys: 0, size: 0, sizeFormatted: '0 KB' };
  }
};

export default {
  saveProjects,
  loadProjects,
  saveTasks,
  loadTasks,
  saveSettings,
  loadSettings,
  saveLastSync,
  getLastSync,
  clearAllStorage,
  getStorageInfo,
};
