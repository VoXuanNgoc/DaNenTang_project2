import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types/booking';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { formatDisplayDate } from '../utils/bookingUtils';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = React.memo(({ booking, onCancel }) => {
  const isConfirmed = booking.status === 'confirmed';

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your reservation for ${booking.roomName} on ${formatDisplayDate(booking.date)} (${booking.startTime} - ${booking.endTime})?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => onCancel(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{booking.roomName}</Text>
          {booking.building && (
            <Text style={styles.buildingText}>{booking.building}</Text>
          )}
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            isConfirmed ? styles.confirmedBadge : styles.cancelledBadge,
          ]}
        >
          <Ionicons
            name={isConfirmed ? 'checkmark-circle' : 'close-circle'}
            size={13}
            color={isConfirmed ? colors.primary : colors.cancelled}
          />
          <Text
            style={[
              styles.statusText,
              isConfirmed ? styles.confirmedText : styles.cancelledText,
            ]}
          >
            {isConfirmed ? 'Confirmed' : 'Cancelled'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={15} color={colors.primary} />
          <Text style={styles.detailText}>{formatDisplayDate(booking.date)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={15} color={colors.primary} />
          <Text style={styles.detailText}>
            {booking.startTime} - {booking.endTime}
          </Text>
        </View>
      </View>

      {/* Action Footer */}
      {isConfirmed && (
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.cancelButton}
            onPress={handleCancelPress}
            accessibilityRole="button"
            accessibilityLabel={`Cancel booking for ${booking.roomName}`}
          >
            <Ionicons name="trash-outline" size={15} color={colors.occupied} />
            <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roomInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  buildingText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  confirmedBadge: {
    backgroundColor: colors.confirmedBg,
    borderColor: colors.confirmedBorder,
  },
  cancelledBadge: {
    backgroundColor: colors.cancelledBg,
    borderColor: colors.cancelledBorder,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  confirmedText: {
    color: colors.confirmed,
  },
  cancelledText: {
    color: colors.cancelled,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.occupied,
  },
});
