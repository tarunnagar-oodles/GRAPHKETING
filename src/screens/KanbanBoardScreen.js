// Screen 2: Kanban Board Screen
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, useTasks, useProjects } from '../hooks';
import { KanbanColumn, AddTaskModal } from '../components/kanban';
import { SPACING, FONT_SIZE, KANBAN_COLUMNS } from '../utils/constants';
import { syncOnProjectSwitch } from '../services/syncService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = SCREEN_WIDTH * 0.75;

const KanbanBoardScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const { colors, isDarkMode } = useTheme();
  const { projects } = useProjects();
  const {
    tasksByStatus,
    createTask,
    changeTaskStatus,
    syncProjectTasks,
    tasks,
  } = useTasks(projectId);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState('todo');
  const [hoveringColumn, setHoveringColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const scrollViewRef = useRef(null);

  const project = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  );

  // Sync when switching to this project
  useEffect(() => {
    syncProjectTasks(projectId);
  }, [projectId]);

  // Handle long press on task - show move options
  const handleTaskLongPress = useCallback(
    (task) => {
      setSelectedTask(task);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      const statusOptions = KANBAN_COLUMNS
        .filter(col => col.id !== task.status)
        .map(col => ({
          text: `Move to ${col.title}`,
          onPress: () => {
            changeTaskStatus(task.id, col.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }));

      Alert.alert(
        'Move Task',
        `Move "${task.title}" to another column`,
        [
          ...statusOptions,
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    },
    [changeTaskStatus]
  );

  const handleTaskPress = useCallback(
    (task) => {
      navigation.navigate('TaskDetails', { taskId: task.id });
    },
    [navigation]
  );

  const handleAddTask = useCallback(
    (status) => {
      setAddTaskStatus(status);
      setIsAddModalVisible(true);
    },
    []
  );

  const handleCreateTask = useCallback(
    (taskData) => {
      createTask({
        ...taskData,
        projectId,
      });
    },
    [createTask, projectId]
  );

  const totalTasks = tasks.length;
  const doneTasks = tasksByStatus.done.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((doneTasks / totalTasks) * 100) 
    : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[styles.headerTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {project?.title || 'Project'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {totalTasks} tasks • {completionPercentage}% complete
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleAddTask('todo')}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boardContainer}
        decelerationRate="fast"
        snapToInterval={COLUMN_WIDTH + SPACING.md}
        snapToAlignment="start"
      >
        {KANBAN_COLUMNS.map((column) => (
          <View
            key={column.id}
            style={styles.columnWrapper}
          >
            <KanbanColumn
              status={column.id}
              tasks={tasksByStatus[column.id] || []}
              onAddTask={() => handleAddTask(column.id)}
              onTaskPress={handleTaskPress}
              onTaskLongPress={handleTaskLongPress}
              isHovering={hoveringColumn === column.id}
              columnWidth={COLUMN_WIDTH}
            />
          </View>
        ))}
      </ScrollView>

      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleCreateTask}
        initialStatus={addTaskStatus}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  columnWrapper: {
    height: '100%',
  },
});

export default KanbanBoardScreen;
