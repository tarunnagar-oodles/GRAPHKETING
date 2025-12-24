// Utility helper functions

/**
 * Generate a unique ID (React Native compatible)
 * Uses a combination of timestamp and random numbers
 */
export const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}-${randomPart2}`;
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date for input
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Calculate completion percentage for a project
 */
export const calculateProjectCompletion = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const doneTasks = tasks.filter((task) => task.status === 'done').length;
  return Math.round((doneTasks / tasks.length) * 100);
};

/**
 * Get tasks by status
 */
export const getTasksByStatus = (tasks, status) => {
  return tasks.filter((task) => task.status === status);
};

/**
 * Group tasks by project
 */
export const groupTasksByProject = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.projectId]) {
      acc[task.projectId] = [];
    }
    acc[task.projectId].push(task);
    return acc;
  }, {});
};

/**
 * Sort tasks by date
 */
export const sortTasksByDate = (tasks, ascending = true) => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Filter tasks by search query
 */
export const filterTasks = (tasks, query) => {
  if (!query) return tasks;
  const lowerQuery = query.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.assignedUser.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Filter projects by search query
 */
export const filterProjects = (projects, query) => {
  if (!query) return projects;
  const lowerQuery = query.toLowerCase();
  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get status color
 */
export const getStatusColor = (status, colors) => {
  switch (status) {
    case 'todo':
      return colors.textSecondary;
    case 'inProgress':
      return colors.warning;
    case 'done':
      return colors.success;
    default:
      return colors.textSecondary;
  }
};

/**
 * Check if date is overdue
 */
export const isOverdue = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
};

/**
 * Get days until due date
 */
export const getDaysUntilDue = (dateString) => {
  if (!dateString) return null;
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
