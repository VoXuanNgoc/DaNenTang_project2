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
      'Xác nhận hủy đặt phòng',
      `Bạn có chắc chắn muốn hủy lịch đặt ${booking.roomName} vào ${formatDisplayDate(booking.date)} (${booking.startTime} - ${booking.endTime}) không?`,
      [
        { text: 'Giữ lại', style: 'cancel' },
        {
          text: 'Hủy lịch đặt',
          style: 'destructive',
          onPress: () => {
            onCancel(booking.id);
            Alert.alert(
              'Hủy thành công',
              `Lịch đặt phòng ${booking.roomName} đã được hủy. Khung giờ này hiện đã sẵn sàng cho sinh viên khác.`,
              [{ text: 'Đóng' }]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{booking.roomName}</Text>
          <View style={styles.buildingRow}>
            <Ionicons name="business-outline" size={13} color={colors.secondaryText} />
            <Text style={styles.buildingText}>{booking.building}</Text>
          </View>
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
            {isConfirmed ? 'Đã xác nhận' : 'Đã hủy'}
          </Text>
        </View>
      </View>

      <View style={styles.codeRow}>
        <Text style={styles.codeLabel}>Mã đặt phòng:</Text>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{booking.bookingCode || booking.id.slice(0, 10)}</Text>
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
            accessibilityLabel={`Hủy lịch đặt cho ${booking.roomName}`}
          >
            <Ionicons name="close-circle-outline" size={15} color={colors.occupied} />
            <Text style={styles.cancelButtonText}>Hủy lịch đặt</Text>
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
  buildingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  buildingText: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 6,
  },
  codeLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
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
    fontSize: 11,
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
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
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
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.occupiedBg,
    borderWidth: 1,
    borderColor: colors.occupiedBorder,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.occupied,
  },
});
