// Theme constants for the app
export const COLORS = {
  light: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#8B5CF6',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Kanban specific
    todoColumn: '#F1F5F9',
    inProgressColumn: '#FEF3C7',
    doneColumn: '#D1FAE5',
    cardShadow: '#00000010',
    dragHighlight: '#6366F120',
  },
  dark: {
    primary: '#818CF8',
    primaryDark: '#6366F1',
    secondary: '#A78BFA',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    border: '#334155',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    
    // Kanban specific
    todoColumn: '#1E293B',
    inProgressColumn: '#422006',
    doneColumn: '#052E16',
    cardShadow: '#00000040',
    dragHighlight: '#818CF840',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  header: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Kanban column configuration
export const KANBAN_COLUMNS = [
  { id: 'todo', title: 'To Do', icon: 'checkbox-blank-circle-outline' },
  { id: 'inProgress', title: 'In Progress', icon: 'progress-clock' },
  { id: 'done', title: 'Done', icon: 'check-circle' },
];

// Default users for assignment dropdown
export const DEFAULT_USERS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson' },
  { id: '4', name: 'Alice Williams' },
  { id: '5', name: 'Charlie Brown' },
];
