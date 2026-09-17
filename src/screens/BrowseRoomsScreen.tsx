import React, { useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrowseStackScreenProps } from '../navigation/types';
import { useRooms } from '../hooks/useRooms';
import { useBookingStore } from '../store/bookingStore';
import { Room } from '../types/room';
import { RoomCard } from '../components/RoomCard';
import { FilterChip } from '../components/FilterChip';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

const FILTER_OPTIONS = [
  'All',
  'Lab',
  'Study Room',
  'Building A3',
  'Available',
  'Occupied',
] as const;

export const BrowseRoomsScreen: React.FC<BrowseStackScreenProps<'BrowseRooms'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { data: rooms, isLoading, isError, error, refetch, isRefetching } = useRooms();

  const searchQuery = useBookingStore((state) => state.searchQuery);
  const setSearchQuery = useBookingStore((state) => state.setSearchQuery);
  const selectedFilters = useBookingStore((state) => state.selectedFilters);
  const toggleFilter = useBookingStore((state) => state.toggleFilter);
  const resetFilters = useBookingStore((state) => state.resetFilters);

  // Filter & search logic
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room) => {
      // 1. Search filter: match room name, building, or room type
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(q);
        const matchesBuilding = room.building.toLowerCase().includes(q);
        const matchesType = room.type.toLowerCase().includes(q);
        if (!matchesName && !matchesBuilding && !matchesType) {
          return false;
        }
      }

      // 2. Chip filters
      if (selectedFilters.includes('All')) {
        return true;
      }

      // If user selected multiple filters (e.g. Lab, Building A3, Available),
      // each category must be satisfied:
      // Types category
      const typeFilters = selectedFilters.filter((f) => f === 'Lab' || f === 'Study Room');
      if (typeFilters.length > 0 && !(typeFilters as string[]).includes(room.type)) {
        return false;
      }

      // Building category
      const buildingFilters = selectedFilters.filter((f) => f === 'Building A3');
      if (buildingFilters.length > 0 && !(buildingFilters as string[]).includes(room.building)) {
        return false;
      }

      // Status category
      const statusFilters = selectedFilters.filter((f) => f === 'Available' || f === 'Occupied');
      if (statusFilters.length > 0) {
        const roomStatusLabel = room.status === 'available' ? 'Available' : 'Occupied';
        if (!statusFilters.includes(roomStatusLabel)) {
          return false;
        }
      }

      return true;
    });
  }, [rooms, searchQuery, selectedFilters]);

  const handleRoomPress = useCallback((roomId: string) => {
    navigation.navigate('RoomDetail', { roomId });
  }, [navigation]);

  const renderRoomItem = useCallback(
    ({ item }: { item: Room }) => (
      <RoomCard room={item} onPress={() => handleRoomPress(item.id)} />
    ),
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="school" size={26} color={colors.primary} />
          <Text style={styles.title}>Browse Rooms</Text>
        </View>
        <Text style={styles.subtitle}>
          Find and reserve available campus study rooms & computer labs
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rooms..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search rooms input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips Horizontal Scroll */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {FILTER_OPTIONS.map((filter) => {
            const isSelected = selectedFilters.includes(filter);
            return (
              <FilterChip
                key={filter}
                label={filter}
                isSelected={isSelected}
                onPress={() => toggleFilter(filter)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading available campus rooms...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.occupied} />
          <Text style={styles.errorTitle}>Failed to Load Rooms</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'An error occurred while fetching campus room data.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={colors.white} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRooms}
          renderItem={renderRoomItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={36} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Rooms Found</Text>
              <Text style={styles.emptySubtitle}>
                No campus study spaces match your current search or active filters.
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
                accessibilityRole="button"
              >
                <Ionicons name="filter-outline" size={16} color={colors.primary} />
                <Text style={styles.resetButtonText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
    paddingBottom: spacing.xs,
  },
  headerTitleRow: {
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
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
  chipsWrapper: {
    marginBottom: spacing.md,
  },
  chipsScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  errorMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primarySubtle,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.confirmedBorder,
    gap: 6,
  },
  resetButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
