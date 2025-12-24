// Kanban Column component
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import TaskCard from './TaskCard';
import { BORDER_RADIUS, SPACING, FONT_SIZE, KANBAN_COLUMNS } from '../../utils/constants';

const KanbanColumn = React.memo(({
  status,
  tasks,
  onAddTask,
  onTaskPress,
  onTaskLongPress,
  isHovering,
  columnWidth,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const columnConfig = KANBAN_COLUMNS.find((c) => c.id === status);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isHovering ? 1.02 : 1,
      useNativeDriver: true,
    }).start();
  }, [isHovering]);
  
  const getColumnBackgroundColor = () => {
    switch (status) {
      case 'todo':
        return colors.todoColumn;
      case 'inProgress':
        return colors.inProgressColumn;
      case 'done':
        return colors.doneColumn;
      default:
        return colors.surfaceVariant;
    }
  };

  const getColumnAccentColor = () => {
    switch (status) {
      case 'todo':
        return colors.textSecondary;
      case 'inProgress':
        return colors.warning;
      case 'done':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: getColumnBackgroundColor(), 
          width: columnWidth,
          transform: [{ scale: scaleAnim }],
          borderColor: isHovering ? colors.primary : 'transparent',
          borderWidth: 2,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getColumnAccentColor() },
            ]}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {columnConfig?.title || status}
          </Text>
          <View
            style={[
              styles.countBadge,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.countText, { color: colors.text }]}>
              {tasks.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onAddTask}
          style={[styles.addButton, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.taskListContent}
        nestedScrollEnabled
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={onTaskPress}
            onLongPress={onTaskLongPress}
            columnWidth={columnWidth - SPACING.lg * 2}
          />
        ))}
        
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              No tasks
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              Tap + to add a task
            </Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    marginRight: SPACING.md,
    height: '100%',
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  countBadge: {
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  taskListContent: {
    paddingBottom: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});

export default KanbanColumn;
