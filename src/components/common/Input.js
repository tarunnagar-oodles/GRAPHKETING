// Custom Input component
import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';
import { BORDER_RADIUS, SPACING, FONT_SIZE } from '../../utils/constants';

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  editable = true,
  style,
  inputStyle,
  ...props
}, ref) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
            minHeight: multiline ? numberOfLines * 24 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          !editable && { opacity: 0.6 },
          inputStyle,
        ]}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  error: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
});

export default Input;
