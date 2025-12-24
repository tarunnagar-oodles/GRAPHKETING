// Animated Progress Bar component
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks';
import { BORDER_RADIUS, SPACING, FONT_SIZE } from '../../utils/constants';

const AnimatedProgressBar = React.memo(({ 
  progress = 0, 
  height = 8, 
  showLabel = true,
  animated = true,
  duration = 800,
}) => {
  const { colors } = useTheme();
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration,
        useNativeDriver: false, // width animation doesn't support native driver
      }).start();
    } else {
      animatedProgress.setValue(progress);
    }
  }, [progress, animated, duration]);

  const getProgressColor = () => {
    if (progress < 30) return colors.error;
    if (progress < 70) return colors.warning;
    return colors.success;
  };

  const widthInterpolation = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Progress
          </Text>
          <Text style={[styles.percentage, { color: colors.text }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: getProgressColor(),
              width: widthInterpolation,
            },
          ]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.sm,
  },
  percentage: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BORDER_RADIUS.full,
  },
});

export default AnimatedProgressBar;
