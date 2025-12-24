// Search Bar component
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { BORDER_RADIUS, SPACING, FONT_SIZE } from '../../utils/constants';

const SearchBar = React.memo(({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant },
        style,
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    paddingVertical: SPACING.sm,
  },
  clearButton: {
    padding: SPACING.xs,
  },
});

export default SearchBar;
