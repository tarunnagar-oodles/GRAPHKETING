// Screen 1: Project List Screen
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProjects, useTasks, useTheme } from '../hooks';
import {
  FloatingActionButton,
  EmptyState,
  LoadingIndicator,
  SearchBar,
} from '../components/common';
import { ProjectCard, AddProjectModal } from '../components/projects';
import { SPACING, FONT_SIZE } from '../utils/constants';
import { filterProjects } from '../utils/helpers';
import { useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/slices/settingsSlice';
import { syncOnAppOpen } from '../services/syncService';

const ProjectListScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const {
    projects,
    isLoading,
    isSyncing,
    loadProjects,
    createProject,
    removeProject,
    syncProjects,
  } = useProjects();
  const { loadTasks, tasks } = useTasks();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  // Sync on app open
  useEffect(() => {
    const syncData = async () => {
      await syncOnAppOpen(projects, tasks);
    };
    if (projects.length > 0 || tasks.length > 0) {
      syncData();
    }
  }, []);

  const filteredProjects = filterProjects(projects, searchQuery);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    loadProjects();
    loadTasks();
    await syncProjects();
    setRefreshing(false);
  }, [loadProjects, loadTasks, syncProjects]);

  const handleProjectPress = useCallback(
    (project) => {
      navigation.navigate('KanbanBoard', { projectId: project.id });
    },
    [navigation]
  );

  const handleProjectLongPress = useCallback(
    (project) => {
      Alert.alert(
        'Delete Project',
        `Are you sure you want to delete "${project.title}"? This will also delete all tasks in this project.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => removeProject(project.id),
          },
        ]
      );
    },
    [removeProject]
  );

  const handleAddProject = useCallback(
    (title, description) => {
      createProject(title, description);
    },
    [createProject]
  );

  const handleToggleDarkMode = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back 👋
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Your Projects
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleToggleDarkMode}
          style={[styles.themeButton, { backgroundColor: colors.surfaceVariant }]}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Search projects..."
        style={styles.searchBar}
      />
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {projects.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Projects
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {tasks.filter((t) => t.status === 'inProgress').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            In Progress
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {tasks.filter((t) => t.status === 'done').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Completed
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProject = useCallback(
    ({ item, index }) => (
      <ProjectCard
        project={item}
        onPress={() => handleProjectPress(item)}
        onLongPress={() => handleProjectLongPress(item)}
        index={index}
      />
    ),
    [handleProjectPress, handleProjectLongPress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  if (isLoading && projects.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LoadingIndicator message="Loading projects..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title={searchQuery ? 'No projects found' : 'No projects yet'}
            description={
              searchQuery
                ? 'Try a different search term'
                : 'Start by creating your first project'
            }
            actionLabel={searchQuery ? undefined : 'Create Project'}
            onAction={searchQuery ? undefined : () => setIsAddModalVisible(true)}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredProjects.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      <FloatingActionButton
        onPress={() => setIsAddModalVisible(true)}
        icon="add"
      />

      <AddProjectModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddProject}
      />

      {isSyncing && (
        <View style={[styles.syncIndicator, { backgroundColor: colors.primary }]}>
          <Text style={styles.syncText}>Syncing...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZE.md,
  },
  title: {
    fontSize: FONT_SIZE.header,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    marginBottom: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginHorizontal: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyListContent: {
    flex: 1,
  },
  syncIndicator: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  syncText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
});

export default ProjectListScreen;
