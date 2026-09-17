import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/bookingStore';
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="person" size={26} color={colors.primary} />
            <Text style={styles.title}>Student Profile</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.studentName}>Nguyen Van A</Text>
          <Text style={styles.studentDepartment}>Department of Computer Science</Text>

          <View style={styles.idBadge}>
            <Ionicons name="card-outline" size={14} color={colors.primary} />
            <Text style={styles.idText}>Student ID: SV2024001</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>nguyenvana@university.edu.vn</Text>
          </View>
        </View>

        {/* Booking Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{confirmedCount}</Text>
            <Text style={styles.statLabel}>Active Bookings</Text>
            <View style={[styles.statDot, { backgroundColor: colors.primary }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cancelledCount}</Text>
            <Text style={styles.statLabel}>Cancelled</Text>
            <View style={[styles.statDot, { backgroundColor: colors.cancelled }]} />
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total History</Text>
            <View style={[styles.statDot, { backgroundColor: colors.available }]} />
          </View>
        </View>

        {/* Quick Action */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('MyBookingsTab')}
          activeOpacity={0.7}
        >
          <View style={styles.quickActionLeft}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.quickActionTitle}>View Active Bookings</Text>
              <Text style={styles.quickActionSubtitle}>
                {confirmedCount} confirmed {confirmedCount === 1 ? 'reservation' : 'reservations'} scheduled
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Campus Room Policies */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.policyTitle}>Campus Study Room Rules</Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.available} />
            <Text style={styles.policyText}>
              Check-in within 15 minutes of your slot to maintain reservation.
            </Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.available} />
            <Text style={styles.policyText}>
              Keep noise levels appropriate for quiet zones and study halls.
            </Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.available} />
            <Text style={styles.policyText}>
              Cancel in advance if your plans change so others can book the space.
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primarySubtle,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.available,
    borderWidth: 2,
    borderColor: colors.white,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  studentDepartment: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 6,
    marginBottom: spacing.md,
  },
  idText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 13,
    color: colors.textSecondary,
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
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
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
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  policyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
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
    fontSize: 15,
    fontWeight: '700',
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
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
