import React, { useState, useMemo, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps } from '../navigation/types';
import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../types/booking';
import { BookingCard } from '../components/BookingCard';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

type FilterTab = 'all' | 'confirmed' | 'cancelled';

export const MyBookingsScreen: React.FC<RootTabScreenProps<'MyBookingsTab'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredBookings = useMemo(() => {
    if (activeTab === 'confirmed') {
      return bookings.filter((b) => b.status === 'confirmed');
    }
    if (activeTab === 'cancelled') {
      return bookings.filter((b) => b.status === 'cancelled');
    }
    return bookings;
  }, [bookings, activeTab]);

  const confirmedCount = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed').length,
    [bookings]
  );
  const cancelledCount = useMemo(
    () => bookings.filter((b) => b.status === 'cancelled').length,
    [bookings]
  );

  const renderBookingItem = useCallback(
    ({ item }: { item: Booking }) => (
      <BookingCard booking={item} onCancel={cancelBooking} />
    ),
    [cancelBooking]
  );

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="calendar" size={26} color={colors.primary} />
          <Text style={styles.title}>My Bookings</Text>
        </View>
        <Text style={styles.subtitle}>
          Manage your room reservations and track booking history
        </Text>
      </View>

      {/* Segmented Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
          onPress={() => setActiveTab('all')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'all' }}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All ({bookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'confirmed' && styles.tabButtonActive]}
          onPress={() => setActiveTab('confirmed')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'confirmed' }}
        >
          <Text
            style={[styles.tabText, activeTab === 'confirmed' && styles.tabTextActive]}
          >
            Confirmed ({confirmedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'cancelled' && styles.tabButtonActive]}
          onPress={() => setActiveTab('cancelled')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'cancelled' }}
        >
          <Text
            style={[styles.tabText, activeTab === 'cancelled' && styles.tabTextActive]}
          >
            Cancelled ({cancelledCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={6}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>You don't have any bookings yet.</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'all'
                ? 'Reserve a study room or computer lab to get started.'
                : activeTab === 'confirmed'
                ? 'No active confirmed reservations right now.'
                : 'No cancelled bookings in your history.'}
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('BrowseTab', { screen: 'BrowseRooms' })}
              accessibilityRole="button"
            >
              <Ionicons name="search" size={16} color={colors.white} />
              <Text style={styles.browseButtonText}>Browse Study Rooms</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: 8,
  },
  browseButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
