import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

interface TimeSlotProps {
  startTime: string;
  endTime: string;
  label: string;
  isSelected: boolean;
  isBooked: boolean;
  onSelect: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = React.memo(({
  label,
  isSelected,
  isBooked,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={isBooked ? 1 : 0.7}
      disabled={isBooked}
      onPress={onSelect}
      style={[
        styles.slot,
        isSelected && styles.slotSelected,
        isBooked && styles.slotBooked,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isBooked }}
      accessibilityLabel={`Time slot ${label} ${isBooked ? 'Unavailable, already booked' : isSelected ? 'Selected' : 'Available'}`}
    >
      <View style={styles.content}>
        <Ionicons
          name={isBooked ? 'lock-closed-outline' : isSelected ? 'checkmark-circle' : 'time-outline'}
          size={16}
          color={
            isBooked
              ? colors.textMuted
              : isSelected
              ? colors.white
              : colors.primary
          }
        />
        <Text
          style={[
            styles.label,
            isSelected && styles.labelSelected,
            isBooked && styles.labelBooked,
          ]}
        >
          {label}
        </Text>
      </View>

      {isBooked && (
        <View style={styles.bookedBadge}>
          <Text style={styles.bookedBadgeText}>Booked</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotBooked: {
    backgroundColor: colors.cancelledBg,
    borderColor: colors.border,
    opacity: 0.65,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  labelSelected: {
    color: colors.white,
  },
  labelBooked: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  bookedBadge: {
    backgroundColor: colors.occupiedBg,
    borderColor: colors.occupiedBorder,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  bookedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.occupied,
    textTransform: 'uppercase',
  },
});
