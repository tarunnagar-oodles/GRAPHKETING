# Mini Project Management App

A production-quality React Native (Expo) application featuring a Kanban-style project management system with advanced animations, drag & drop interactions, and offline-first storage.

## 📱 Screenshots

[Add your screenshots/screen recordings here]

## ✨ Features

### Core Features
- **Project List Screen** (Screen 1)
  - Display list of projects with animated progress bars
  - Project completion percentage based on task status
  - Optimized FlatList with React.memo and useCallback
  - Search functionality
  - Dark mode toggle
  - Floating action button for adding projects
  - Pull-to-refresh with sync simulation

- **Kanban Board Screen** (Screen 2)
  - Three-column Trello-like board (To Do, In Progress, Done)
  - Drag & drop tasks between columns
  - Real-time completion percentage updates
  - Smooth animations with Reanimated 3
  - Haptic feedback on interactions
  - Column highlighting on drag hover

- **Task Details Screen** (Screen 3)
  - Editable task fields (title, description, status, assignee, hours)
  - Auto-save functionality
  - Image attachment support
  - Due date display with overdue indicators
  - Fade-in entrance animation
  - Delete task functionality

### Bonus Features Implemented
- ✅ **Deep Linking** - Navigate directly to projects or tasks via URL
- ✅ **Dark Mode** - Full dark/light theme support
- ✅ **Search & Filters** - Search projects from the main screen
- ✅ **Haptic Feedback** - Native haptic feedback on interactions

## 🏗️ Architecture

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── AnimatedProgressBar.js
│   │   ├── Button.js
│   │   ├── EmptyState.js
│   │   ├── FloatingActionButton.js
│   │   ├── Input.js
│   │   ├── LoadingIndicator.js
│   │   ├── Modal.js
│   │   ├── SearchBar.js
│   │   └── Select.js
│   ├── kanban/           # Kanban board components
│   │   ├── AddTaskModal.js
│   │   ├── KanbanColumn.js
│   │   └── TaskCard.js
│   └── projects/         # Project-related components
│       ├── AddProjectModal.js
│       └── ProjectCard.js
├── hooks/                # Custom React hooks
│   ├── useProjects.js
│   ├── useTasks.js
│   └── useTheme.js
├── navigation/           # React Navigation setup
│   ├── AppNavigator.js
│   └── linking.js
├── screens/              # Main app screens
│   ├── KanbanBoardScreen.js
│   ├── ProjectListScreen.js
│   └── TaskDetailsScreen.js
├── services/             # Business logic services
│   ├── storage.js        # MMKV storage wrapper
│   └── syncService.js    # Fake API sync simulation
├── store/                # Redux store
│   ├── index.js
│   └── slices/
│       ├── projectsSlice.js
│       ├── settingsSlice.js
│       └── tasksSlice.js
├── types/                # TypeScript type definitions
│   └── index.ts
└── utils/                # Utility functions
    ├── constants.js      # Theme colors, spacing, etc.
    └── helpers.js        # Helper functions
```

## 🛠️ Tech Stack

### Core
- **React Native** (Expo SDK 54)
- **React 19.1**

### State Management
- **Redux Toolkit** - Centralized state management with slices

### Storage
- **react-native-mmkv** - Fast, offline-first key-value storage

### Navigation
- **React Navigation v6** - Native stack navigator with deep linking

### Animations
- **react-native-reanimated v3** - 60fps performant animations
- **react-native-gesture-handler** - Drag & drop interactions

### Additional Libraries
- **@expo/vector-icons** - Ionicons icon set
- **expo-haptics** - Native haptic feedback
- **expo-image-picker** - Image selection
- **expo-linking** - Deep linking support
- **uuid** - Unique ID generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd RNCourse
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npx expo start
```

4. Run on device/simulator
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

### Deep Linking URLs
```
# Open Projects List
projectmanager://projects

# Open specific project Kanban board
projectmanager://project/{projectId}

# Open specific task details
projectmanager://task/{taskId}
```

## 📊 Performance Optimizations

1. **FlatList Optimizations**
   - `removeClippedSubviews={true}`
   - `maxToRenderPerBatch={10}`
   - `windowSize={10}`

2. **Component Memoization**
   - `React.memo` on list items
   - `useCallback` for event handlers
   - `useMemo` for computed values

3. **Animation Performance**
   - All animations run on UI thread via Reanimated
   - Layout animations use `Layout.springify()`
   - 60fps maintained even with 50+ tasks

## 🔄 State Flow

```
User Action → Redux Action → Reducer Update → MMKV Persist → Fake Sync → UI Update
```

### Sync Points
- App opens
- Project switch
- Task update/move

## 🎨 Theming

The app supports full dark/light mode theming with colors defined in `src/utils/constants.js`:

- Primary colors
- Background & surface colors
- Status-specific colors (success, warning, error)
- Kanban column-specific colors

## 📝 Git Commit Guidelines

```
feat: Add new feature
fix: Bug fix
refactor: Code refactoring
style: UI/styling changes
docs: Documentation updates
perf: Performance improvements
```

## 🔮 Future Improvements

- [ ] Push notifications for due tasks
- [ ] Lottie animation on app start
- [ ] Native module for device storage checker
- [ ] Task search within Kanban board
- [ ] Task reordering within columns
- [ ] Offline image caching with expo-file-system

## 📄 License

This project is created for GRAPHKETING React Native Hiring Assignment.

---

Built with ❤️ using React Native & Expo
