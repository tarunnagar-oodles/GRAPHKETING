// Project Card component for the project list
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { AnimatedProgressBar } from '../common';
import { BORDER_RADIUS, SPACING, FONT_SIZE, SHADOWS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const ProjectCard = React.memo(({
  project,
  onPress,
  onLongPress,
  index = 0,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.container,
          SHADOWS.md,
          { backgroundColor: colors.surface },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Ionicons name="folder" size={20} color={colors.primary} />
            </View>
            <View style={styles.titleWrapper}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {project.title}
              </Text>
              <Text
                style={[styles.date, { color: colors.textTertiary }]}
                numberOfLines={1}
              >
                Created {formatDate(project.createdAt)}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>

        {project.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {project.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons
                name="checkbox-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {project.totalTasks} tasks
              </Text>
            </View>
          </View>
        </View>

        <AnimatedProgressBar
          progress={project.completion}
          height={6}
          showLabel={false}
        />
        <Text style={[styles.completionText, { color: colors.textSecondary }]}>
          {project.completion}% complete
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  date: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  completionText: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm,
    textAlign: 'right',
  },
});

export default ProjectCard;
