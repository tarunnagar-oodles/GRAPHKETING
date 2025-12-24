// Loading Indicator component
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';
import { SPACING, FONT_SIZE } from '../../utils/constants';

const LoadingIndicator = ({ message = 'Loading...' }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: SPACING.lg,
    fontSize: FONT_SIZE.md,
  },
});

export default LoadingIndicator;
