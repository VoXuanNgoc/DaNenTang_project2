import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const FilterChip: React.FC<FilterChipProps> = React.memo(({
  label,
  isSelected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        isSelected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`Filter by ${label}`}
    >
      <Text
        style={[
          styles.label,
          isSelected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.white,
  },
  labelUnselected: {
    color: colors.textSecondary,
  },
});
