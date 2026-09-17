import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps } from '../navigation/types';
import { useBookingStore, CURRENT_STUDENT } from '../store/bookingStore';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';

export const ProfileScreen: React.FC<RootTabScreenProps<'ProfileTab'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const bookings = useBookingStore((state) => state.bookings);

  const confirmedCount = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed').length,
    [bookings]
  );
  const cancelledCount = useMemo(
    () => bookings.filter((b) => b.status === 'cancelled').length,
    [bookings]
  );
  const totalCount = bookings.length;

  const handleMenuPress = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'Đóng' }]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.headerIconWrapper}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Hồ sơ sinh viên</Text>
              <Text style={styles.subtitle}>Quản lý thông tin học tập & tài khoản phòng học</Text>
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{CURRENT_STUDENT.avatarLetter}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={colors.white} />
            </View>
          </View>

          <Text style={styles.studentName}>{CURRENT_STUDENT.name}</Text>
          <Text style={styles.studentDepartment}>Khoa Công nghệ Thông tin</Text>

          <View style={styles.badgesRow}>
            <View style={styles.idBadge}>
              <Ionicons name="card-outline" size={14} color={colors.primary} />
              <Text style={styles.idText}>MSSV: {CURRENT_STUDENT.studentId}</Text>
            </View>

            <View style={styles.roleBadge}>
              <Ionicons name="school-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.roleText}>{CURRENT_STUDENT.role}</Text>
            </View>
          </View>

          <View style={styles.emailContainer}>
            <Ionicons name="mail-outline" size={15} color={colors.secondaryText} />
            <Text style={styles.emailText}>{CURRENT_STUDENT.email}</Text>
          </View>
        </View>

        {/* Thống kê Bookings */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Tổng booking</Text>
            <View style={[styles.statDot, { backgroundColor: colors.primary }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.available }]}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Sắp tới</Text>
            <View style={[styles.statDot, { backgroundColor: colors.available }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.occupied }]}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>Đã hủy</Text>
            <View style={[styles.statDot, { backgroundColor: colors.occupied }]} />
          </View>
        </View>

        {/* Danh sách Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Tùy chọn tài khoản</Text>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              handleMenuPress(
                'Thông tin cá nhân',
                `Họ tên: ${CURRENT_STUDENT.name}\nMã sinh viên: ${CURRENT_STUDENT.studentId}\nEmail: ${CURRENT_STUDENT.email}\nKhoa: Công nghệ Thông tin\nTrạng thái tài khoản: Đang hoạt động`
              )
            }
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Thông tin cá nhân</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MyBookingsTab')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Lịch đặt phòng</Text>
            </View>
            <View style={styles.menuRightBadge}>
              <Text style={styles.menuRightBadgeText}>{confirmedCount} lịch</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              handleMenuPress(
                'Trợ giúp & Hỗ trợ',
                'Phòng Quản lý Giảng đường và Phòng Lab\nHotline: (028) 3835 4409\nEmail hỗ trợ: support.phonghoc@university.edu.vn\nThời gian làm việc: 07:30 - 17:00 từ Thứ 2 đến Thứ 6'
              )
            }
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="help-circle-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Trợ giúp</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              handleMenuPress(
                'Cài đặt ứng dụng',
                'Phiên bản ứng dụng: 2.0.0 (Expo SDK 57)\nNgôn ngữ: Tiếng Việt\nThông báo phòng học: Đang bật\nTheme: Tím hiện đại (Modern University Study App)'
              )
            }
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="settings-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuTitle}>Cài đặt</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Nội quy phòng học */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={styles.policyTitle}>Quy định sử dụng phòng học</Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle" size={15} color={colors.available} />
            <Text style={styles.policyText}>
              Có mặt đúng giờ đăng ký và giữ trật tự chung trong khuôn viên học tập.
            </Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle" size={15} color={colors.available} />
            <Text style={styles.policyText}>
              Bảo quản trang thiết bị máy tính, máy chiếu và tắt điều hòa khi ra về.
            </Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle" size={15} color={colors.available} />
            <Text style={styles.policyText}>
              Chủ động hủy lịch đặt nếu không sử dụng để nhường chỗ cho sinh viên khác.
            </Text>
          </View>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.available,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  studentDepartment: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A6D0B',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  emailText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
  },
  statDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  menuRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuRightBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  policyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  policyText: {
    flex: 1,
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 18,
  },
});
