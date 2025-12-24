// Custom Dropdown/Select component
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { BORDER_RADIUS, SPACING, FONT_SIZE, SHADOWS } from '../../utils/constants';

const Select = ({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select an option',
  error,
  style,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.id === value || opt.value === value);

  const handleSelect = (option) => {
    onSelect(option.id || option.value);
    setIsOpen(false);
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.selectButton,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.selectText,
            { color: selectedOption ? colors.text : colors.textTertiary },
          ]}
        >
          {selectedOption ? selectedOption.name || selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            styles.dropdown,
            SHADOWS.md,
            { 
              backgroundColor: colors.surface, 
              borderColor: colors.border,
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <ScrollView style={styles.optionsList} nestedScrollEnabled>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.id || option.value || index}
                onPress={() => handleSelect(option)}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      (option.id === value || option.value === value)
                        ? colors.primaryDark + '20'
                        : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        (option.id === value || option.value === value)
                          ? colors.primary
                          : colors.text,
                    },
                  ]}
                >
                  {option.name || option.label}
                </Text>
                {(option.id === value || option.value === value) && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    zIndex: 1000,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  selectText: {
    fontSize: FONT_SIZE.md,
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    zIndex: 1001,
  },
  optionsList: {
    maxHeight: 200,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  optionText: {
    fontSize: FONT_SIZE.md,
  },
  error: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
});

export default Select;
