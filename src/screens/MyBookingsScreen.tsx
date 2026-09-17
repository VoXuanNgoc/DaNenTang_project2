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
import { EmptyState } from '../components/EmptyState';
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
          <View style={styles.headerIconWrapper}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>Lịch đặt phòng của tôi</Text>
            <Text style={styles.subtitle}>
              Tổng cộng {bookings.length} lượt đặt phòng ({confirmedCount} đang hiệu lực)
            </Text>
          </View>
        </View>
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
            Tất cả ({bookings.length})
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
            Sắp tới ({confirmedCount})
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
            Đã hủy ({cancelledCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách Bookings */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState
            iconName="calendar-outline"
            title="Bạn chưa có lịch đặt phòng nào."
            description="Hãy tìm một phòng phù hợp để bắt đầu học tập và ôn luyện đồ án."
            buttonText="Khám phá phòng học"
            buttonIcon="search"
            onButtonPress={() => navigation.navigate('BrowseTab', { screen: 'BrowseRooms' })}
          />
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
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
