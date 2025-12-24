// Task Card for Kanban Board
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks';
import { BORDER_RADIUS, SPACING, FONT_SIZE, SHADOWS } from '../../utils/constants';
import { formatDate, isOverdue, getDaysUntilDue } from '../../utils/helpers';

const TaskCard = React.memo(({
  task,
  onPress,
  onLongPress,
  columnWidth,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onLongPress) {
      onLongPress(task);
    }
  };

  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  const getStatusColor = () => {
    switch (task.status) {
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={() => onPress && onPress(task)}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        delayLongPress={300}
        style={[
          styles.container,
          SHADOWS.sm,
          { backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>

        {task.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={overdue ? colors.error : colors.textTertiary}
              />
              <Text
                style={[
                  styles.dueDate,
                  { color: overdue ? colors.error : colors.textTertiary },
                ]}
              >
                {overdue
                  ? 'Overdue'
                  : daysUntilDue === 0
                  ? 'Today'
                  : daysUntilDue === 1
                  ? 'Tomorrow'
                  : formatDate(task.dueDate)}
              </Text>
            </View>
          )}

          {task.assignedUser && (
            <View style={styles.assignee}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.primary + '30' },
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {task.assignedUser.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {task.estimatedHours > 0 && (
          <View style={styles.hours}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text style={[styles.hoursText, { color: colors.textTertiary }]}>
              {task.estimatedHours}h
            </Text>
          </View>
        )}

        {task.imageUri && (
          <View style={styles.imageIndicator}>
            <Ionicons name="image-outline" size={12} color={colors.textTertiary} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  description: {
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: FONT_SIZE.xs,
    marginLeft: 4,
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  hoursText: {
    fontSize: FONT_SIZE.xs,
    marginLeft: 4,
  },
  imageIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
});

export default TaskCard;
