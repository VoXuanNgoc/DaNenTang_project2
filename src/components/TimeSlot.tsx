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
      activeOpacity={isBooked ? 1 : 0.75}
      disabled={isBooked}
      onPress={onSelect}
      style={[
        styles.slot,
        isSelected && styles.slotSelected,
        isBooked && styles.slotBooked,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isBooked }}
      accessibilityLabel={`Khung giờ ${label}: ${isBooked ? 'Đã đặt' : isSelected ? 'Đang chọn' : 'Còn trống'}`}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconWrapper,
            isSelected && styles.iconWrapperSelected,
            isBooked && styles.iconWrapperBooked,
          ]}
        >
          <Ionicons
            name={
              isBooked
                ? 'close-circle-outline'
                : isSelected
                ? 'checkmark-circle'
                : 'time-outline'
            }
            size={18}
            color={
              isBooked
                ? colors.occupied
                : isSelected
                ? colors.white
                : colors.primary
            }
          />
        </View>

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

      <View
        style={[
          styles.badge,
          isBooked
            ? styles.badgeBooked
            : isSelected
            ? styles.badgeSelected
            : styles.badgeAvailable,
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            isBooked
              ? styles.badgeTextBooked
              : isSelected
              ? styles.badgeTextSelected
              : styles.badgeTextAvailable,
          ]}
        >
          {isBooked ? 'Đã đặt' : isSelected ? 'Đang chọn' : 'Còn trống'}
        </Text>
      </View>
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  slotBooked: {
    backgroundColor: colors.cancelledBg,
    borderColor: colors.border,
    opacity: 0.7,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconWrapperBooked: {
    backgroundColor: colors.occupiedBg,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  labelSelected: {
    color: colors.white,
  },
  labelBooked: {
    color: colors.secondaryText,
    textDecorationLine: 'line-through',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeAvailable: {
    backgroundColor: colors.availableBg,
    borderColor: colors.availableBorder,
  },
  badgeSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  badgeBooked: {
    backgroundColor: colors.occupiedBg,
    borderColor: colors.occupiedBorder,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextAvailable: {
    color: colors.available,
  },
  badgeTextSelected: {
    color: colors.text,
  },
  badgeTextBooked: {
    color: colors.occupied,
  },
});
