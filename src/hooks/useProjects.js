// Custom hook for project operations
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  fetchProjects,
  saveProjectsAsync,
  syncProjectsAsync,
  selectProjects,
  selectCurrentProject,
  selectIsLoading,
  selectIsSyncing,
} from '../store/slices/projectsSlice';
import { deleteTasksByProject, selectTasks, saveTasksAsync } from '../store/slices/tasksSlice';
import { calculateProjectCompletion } from '../utils/helpers';

const useProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const currentProject = useSelector(selectCurrentProject);
  const isLoading = useSelector(selectIsLoading);
  const isSyncing = useSelector(selectIsSyncing);
  const allTasks = useSelector(selectTasks);

  // Get projects with computed completion percentages
  const projectsWithCompletion = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = allTasks.filter((t) => t.projectId === project.id);
      const completion = calculateProjectCompletion(projectTasks);
      const totalTasks = projectTasks.length;
      return {
        ...project,
        completion,
        totalTasks,
      };
    });
  }, [projects, allTasks]);

  const loadProjects = useCallback(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const createProject = useCallback(
    (title, description = '') => {
      dispatch(addProject({ title, description }));
      // Save projects to storage after adding
      setTimeout(() => {
        dispatch(saveProjectsAsync([...projects, { title, description }]));
      }, 100);
    },
    [dispatch, projects]
  );

  const editProject = useCallback(
    (id, updates) => {
      dispatch(updateProject({ id, ...updates }));
      // Save projects to storage after updating
      setTimeout(() => {
        const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
        dispatch(saveProjectsAsync(updatedProjects));
      }, 100);
    },
    [dispatch, projects]
  );

  const removeProject = useCallback(
    (id) => {
      dispatch(deleteProject(id));
      dispatch(deleteTasksByProject(id));
      // Save projects and tasks to storage after deleting
      setTimeout(() => {
        const filteredProjects = projects.filter(p => p.id !== id);
        const filteredTasks = allTasks.filter(t => t.projectId !== id);
        dispatch(saveProjectsAsync(filteredProjects));
        dispatch(saveTasksAsync(filteredTasks));
      }, 100);
    },
    [dispatch, projects, allTasks]
  );

  const selectProject = useCallback(
    (id) => {
      dispatch(setCurrentProject(id));
    },
    [dispatch]
  );

  const syncProjects = useCallback(() => {
    dispatch(syncProjectsAsync());
  }, [dispatch]);

  return {
    projects: projectsWithCompletion,
    currentProject,
    isLoading,
    isSyncing,
    loadProjects,
    createProject,
    editProject,
    removeProject,
    selectProject,
    syncProjects,
  };
};

export default useProjects;
