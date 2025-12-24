import React, { useEffect } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import { AppNavigator, linking } from './src/navigation';
import { fetchProjects } from './src/store/slices/projectsSlice';
import { fetchTasks } from './src/store/slices/tasksSlice';
import { fetchSettings } from './src/store/slices/settingsSlice';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// App content component to use hooks
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load all data from storage on app start
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchSettings());
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
