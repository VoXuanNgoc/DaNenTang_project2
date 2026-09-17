import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrowseStackScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { formatDisplayDate } from '../utils/bookingUtils';

export const BookingConfirmationScreen: React.FC<
  BrowseStackScreenProps<'BookingConfirmation'>
> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { booking } = route.params;

  const handleGoToBookings = () => {
    navigation.getParent()?.navigate('MyBookingsTab');
  };

  const handleBackToBrowse = () => {
    navigation.navigate('BrowseRooms');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon Animation / Circle */}
        <View style={styles.successIconWrapper}>
          <View style={styles.iconOuterRing}>
            <View style={styles.iconInnerCircle}>
              <Ionicons name="checkmark-circle" size={64} color={colors.accent} />
            </View>
          </View>
          <View style={styles.sparkleBadge}>
            <Ionicons name="sparkles" size={16} color={colors.white} />
          </View>
        </View>

        <Text style={styles.successTitle}>Đặt phòng thành công! 🎉</Text>
        <Text style={styles.successSubtitle}>
          Lịch học của bạn đã được ghi nhận vào hệ thống phòng học trường đại học.
        </Text>

        {/* Confirmation Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.ticketLabel}>MÃ ĐẶT PHÒNG</Text>
              <Text style={styles.ticketCode}>{booking.bookingCode}</Text>
            </View>
            <View style={styles.confirmedPill}>
              <Ionicons name="shield-checkmark" size={13} color={colors.available} />
              <Text style={styles.confirmedPillText}>ĐÃ XÁC NHẬN</Text>
            </View>
          </View>

          <View style={styles.ticketDottedLine} />

          <View style={styles.ticketBody}>
            {/* Room Name & Building */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="business" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Phòng học & Tòa nhà</Text>
                <Text style={styles.infoValueBold}>{booking.roomName}</Text>
                <Text style={styles.infoSubtext}>{booking.building}</Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Ngày đặt</Text>
                <Text style={styles.infoValueBold}>{formatDisplayDate(booking.date)}</Text>
              </View>
            </View>

            {/* Time slot */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="time" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Khung giờ</Text>
                <Text style={styles.infoValueBold}>
                  {booking.startTime} - {booking.endTime}
                </Text>
              </View>
            </View>

            {/* Student Info */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Sinh viên đăng ký</Text>
                <Text style={styles.infoValueBold}>{booking.studentName}</Text>
                <Text style={styles.infoSubtext}>MSSV: {booking.studentId}</Text>
              </View>
            </View>
          </View>

          {/* Quick Notice */}
          <View style={styles.noticeBox}>
            <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.noticeText}>
              Vui lòng có mặt đúng giờ và xuất trình thẻ sinh viên hoặc mã đặt phòng khi nhận phòng.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoToBookings}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Ionicons name="calendar-outline" size={18} color={colors.white} />
            <Text style={styles.primaryButtonText}>Xem lịch đặt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackToBrowse}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back-outline" size={18} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Quay lại danh sách phòng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  successIconWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  iconOuterRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInnerCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  ticketLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryText,
    letterSpacing: 1,
  },
  ticketCode: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  confirmedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.availableBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.availableBorder,
  },
  confirmedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.available,
  },
  ticketDottedLine: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
  },
  ticketBody: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  infoValueBold: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  infoSubtext: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 1,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primarySubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
