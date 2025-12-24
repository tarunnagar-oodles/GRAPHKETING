// Deep Linking configuration
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking = {
  prefixes: [prefix, 'projectmanager://'],
  config: {
    screens: {
      ProjectList: 'projects',
      KanbanBoard: {
        path: 'project/:projectId',
        parse: {
          projectId: (projectId) => projectId,
        },
      },
      TaskDetails: {
        path: 'task/:taskId',
        parse: {
          taskId: (taskId) => taskId,
        },
      },
    },
  },
};

export default linking;
