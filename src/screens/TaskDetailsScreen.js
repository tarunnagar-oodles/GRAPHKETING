// Screen 3: Task Details Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useTheme, useTasks } from '../hooks';
import { Input, Button, Select } from '../components/common';
import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
  DEFAULT_USERS,
  KANBAN_COLUMNS,
} from '../utils/constants';
import { formatDate, isOverdue, getDaysUntilDue } from '../utils/helpers';

const TaskDetailsScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { colors } = useTheme();
  const { tasks, editTask, removeTask, selectTaskById, currentTask, deselectTask } = useTasks();

  const task = tasks.find((t) => t.id === taskId) || currentTask;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [assignedUser, setAssignedUser] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with task data
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setAssignedUser(
        DEFAULT_USERS.find((u) => u.name === task.assignedUser)?.id || ''
      );
      setEstimatedHours(task.estimatedHours?.toString() || '');
      setImageUri(task.imageUri || null);
    }
  }, [task]);

  // Track changes
  useEffect(() => {
    if (task) {
      const changed =
        title !== task.title ||
        description !== task.description ||
        status !== task.status ||
        DEFAULT_USERS.find((u) => u.id === assignedUser)?.name !== task.assignedUser ||
        estimatedHours !== (task.estimatedHours?.toString() || '') ||
        imageUri !== task.imageUri;
      setHasChanges(changed);
    }
  }, [title, description, status, assignedUser, estimatedHours, imageUri, task]);

  // Auto-save on changes
  useEffect(() => {
    if (hasChanges && task) {
      const saveTimeout = setTimeout(() => {
        handleSave();
      }, 1000); // Debounce save by 1 second
      return () => clearTimeout(saveTimeout);
    }
  }, [title, description, status, assignedUser, estimatedHours, imageUri, hasChanges]);

  const handleSave = useCallback(() => {
    if (!task) return;
    
    editTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      status,
      assignedUser: DEFAULT_USERS.find((u) => u.id === assignedUser)?.name || '',
      estimatedHours: parseFloat(estimatedHours) || 0,
      imageUri,
    });
    setHasChanges(false);
  }, [task, title, description, status, assignedUser, estimatedHours, imageUri, editTask]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeTask(taskId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            navigation.goBack();
          },
        },
      ]
    );
  }, [taskId, removeTask, navigation]);

  const handlePickImage = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageUri(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const statusOptions = KANBAN_COLUMNS.map((col) => ({
    id: col.id,
    name: col.title,
  }));

  const getStatusColor = () => {
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

  if (!task) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Task not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Task Details
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.deleteButton, { backgroundColor: colors.error + '20' }]}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Badge */}
          <View
            style={styles.statusSection}
          >
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() + '20' },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
              />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {KANBAN_COLUMNS.find((c) => c.id === status)?.title || status}
              </Text>
            </View>
            {task.dueDate && (
              <View
                style={[
                  styles.dueBadge,
                  {
                    backgroundColor: overdue
                      ? colors.error + '20'
                      : colors.surfaceVariant,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={overdue ? colors.error : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.dueText,
                    { color: overdue ? colors.error : colors.textSecondary },
                  ]}
                >
                  {overdue
                    ? 'Overdue'
                    : daysUntilDue === 0
                    ? 'Due Today'
                    : daysUntilDue === 1
                    ? 'Due Tomorrow'
                    : `Due ${formatDate(task.dueDate)}`}
                </Text>
              </View>
            )}
          </View>

          {/* Form Fields */}
          <View>
            <Input
              label="Title"
              placeholder="Enter task title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Input
              label="Description"
              placeholder="Enter task description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View>
            <Select
              label="Status"
              value={status}
              options={statusOptions}
              onSelect={setStatus}
            />
          </View>

          <View>
            <Select
              label="Assigned To"
              value={assignedUser}
              options={DEFAULT_USERS}
              onSelect={setAssignedUser}
              placeholder="Select team member"
            />
          </View>

          <View>
            <Input
              label="Estimated Hours"
              placeholder="e.g., 4"
              value={estimatedHours}
              onChangeText={setEstimatedHours}
              keyboardType="numeric"
            />
          </View>

          {/* Image Section */}
          <View>
            <Text style={[styles.label, { color: colors.text }]}>
              Attachment
            </Text>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <TouchableOpacity
                  onPress={handleRemoveImage}
                  style={[
                    styles.removeImageButton,
                    { backgroundColor: colors.error },
                  ]}
                >
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handlePickImage}
                style={[
                  styles.uploadButton,
                  { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
                ]}
              >
                <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
                <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                  Tap to upload an image
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Meta Info */}
          <View
            style={[styles.metaSection, { backgroundColor: colors.surfaceVariant, zIndex: -4 }]}
          >
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Created
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {formatDate(task.createdAt)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                Last Updated
              </Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          </View>

          {/* Save Indicator */}
          {hasChanges && (
            <View
              style={[styles.saveIndicator, { backgroundColor: colors.primary + '20' }]}
            >
              <Ionicons name="sync" size={14} color={colors.primary} />
              <Text style={[styles.saveText, { color: colors.primary }]}>
                Auto-saving...
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginLeft: SPACING.md,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginLeft: SPACING.sm,
  },
  dueText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  imageSection: {
    marginBottom: SPACING.lg,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  metaSection: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metaLabel: {
    fontSize: FONT_SIZE.sm,
  },
  metaValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  saveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.lg,
    alignSelf: 'center',
  },
  saveText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  notFoundText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginVertical: SPACING.lg,
  },
});

export default TaskDetailsScreen;
