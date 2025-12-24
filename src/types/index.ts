// Type definitions for the Project Management App

export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  assignedUser: string;
  estimatedHours: number;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  currentProject: Project | null;
  currentTask: Task | null;
  isLoading: boolean;
  isSyncing: boolean;
  isDarkMode: boolean;
}

// Redux action types
export interface AddProjectPayload {
  title: string;
  description: string;
}

export interface UpdateProjectPayload {
  id: string;
  title?: string;
  description?: string;
}

export interface AddTaskPayload {
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  assignedUser: string;
  estimatedHours: number;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  assignedUser?: string;
  estimatedHours?: number;
  imageUri?: string;
}

export interface MoveTaskPayload {
  taskId: string;
  newStatus: TaskStatus;
}

// Navigation types
export type RootStackParamList = {
  ProjectList: undefined;
  KanbanBoard: { projectId: string };
  TaskDetails: { taskId: string };
};
