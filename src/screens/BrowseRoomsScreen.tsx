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
import { useBookingStore, CURRENT_STUDENT } from '../store/bookingStore';
import { Room } from '../types/room';
import { RoomCard } from '../components/RoomCard';
import { FilterChip } from '../components/FilterChip';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

const FILTER_OPTIONS = [
  'Tất cả',
  'Phòng Lab',
  'Phòng học',
  'Tòa A3',
  'Thư viện',
  'Còn trống',
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
      // 1. Tìm kiếm theo tên, tòa nhà hoặc loại phòng
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(q);
        const matchesBuilding = room.building.toLowerCase().includes(q);
        const matchesType = room.type.toLowerCase().includes(q);
        if (!matchesName && !matchesBuilding && !matchesType) {
          return false;
        }
      }

      // 2. Bộ lọc chip
      if (selectedFilters.includes('Tất cả')) {
        return true;
      }

      // Loại phòng: "Phòng Lab" hoặc "Phòng học"
      const typeFilters = selectedFilters.filter((f) => f === 'Phòng Lab' || f === 'Phòng học');
      if (typeFilters.length > 0) {
        const matchesAnyType = typeFilters.some((f) => {
          if (f === 'Phòng Lab') return room.type.includes('Lab');
          if (f === 'Phòng học') return room.type.includes('Phòng học') || room.type.includes('Study');
          return false;
        });
        if (!matchesAnyType) return false;
      }

      // Tòa nhà: "Tòa A3"
      if (selectedFilters.includes('Tòa A3') && !room.building.includes('A3')) {
        return false;
      }

      // Thư viện: "Thư viện"
      if (selectedFilters.includes('Thư viện') && !room.building.includes('Thư viện') && !room.building.includes('Library')) {
        return false;
      }

      // Trạng thái: "Còn trống"
      if (selectedFilters.includes('Còn trống') && room.status !== 'available') {
        return false;
      }

      return true;
    });
  }, [rooms, searchQuery, selectedFilters]);

  // Danh sách phòng nổi bật cho horizontal section
  const featuredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((r) => r.isFeatured || r.capacity >= 30);
  }, [rooms]);

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

  // Header Component for FlatList (Search, Greeting, Chips, Featured Section)
  const renderListHeader = () => (
    <View>
      {/* Header chào người dùng */}
      <View style={styles.header}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingName}>
            Xin chào, {CURRENT_STUDENT.name} 👋
          </Text>
          <Text style={styles.subtitle}>
            Tìm một không gian học tập phù hợp với bạn.
          </Text>
        </View>

        {/* Avatar tròn với chữ N */}
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => navigation.getParent()?.navigate('ProfileTab')}
          accessibilityRole="button"
          accessibilityLabel="Trang cá nhân của sinh viên"
        >
          <Text style={styles.avatarLetter}>{CURRENT_STUDENT.avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm phòng học..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Ô tìm kiếm phòng học"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              accessibilityLabel="Xóa nội dung tìm kiếm"
            >
              <Ionicons name="close-circle" size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bộ lọc dạng chip */}
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

      {/* Nút xóa bộ lọc nếu đang áp dụng lọc */}
      {(!selectedFilters.includes('Tất cả') || searchQuery.length > 0) && (
        <View style={styles.activeFilterNoticeRow}>
          <Text style={styles.activeFilterNoticeText}>
            Đang lọc: {filteredRooms.length} phòng phù hợp
          </Text>
          <TouchableOpacity
            style={styles.clearFilterInlineButton}
            onPress={resetFilters}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={13} color={colors.primary} />
            <Text style={styles.clearFilterInlineText}>Đặt lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. Khu vực phòng nổi bật */}
      {featuredRooms.length > 0 && searchQuery.length === 0 && selectedFilters.includes('Tất cả') && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flame" size={18} color={colors.accent} />
              <Text style={styles.sectionTitle}>Phòng học nổi bật</Text>
            </View>
            <Text style={styles.sectionBadgeText}>{featuredRooms.length} không gian</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScrollContent}
          >
            {featuredRooms.map((room) => (
              <RoomCard
                key={`featured-${room.id}`}
                room={room}
                horizontal={true}
                onPress={() => handleRoomPress(room.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 5. Section title Tất cả phòng học */}
      <View style={styles.allRoomsHeaderRow}>
        <Text style={styles.allRoomsTitle}>Tất cả phòng học</Text>
        <Text style={styles.allRoomsCount}>({filteredRooms.length} phòng)</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách phòng học...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.occupied} />
          <Text style={styles.errorTitle}>Không thể tải dữ liệu</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Đã có lỗi xảy ra khi tải danh sách phòng học trường.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={16} color={colors.white} />
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRooms}
          renderItem={renderRoomItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderListHeader}
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
            <EmptyState
              iconName="search-outline"
              title="Không tìm thấy phòng phù hợp"
              description="Không có phòng học nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại của bạn."
              buttonText="Xóa tất cả bộ lọc"
              buttonIcon="filter-outline"
              onButtonPress={resetFilters}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  greetingTextContainer: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  greetingName: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 3,
    fontWeight: '500',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
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
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  clearButton: {
    padding: spacing.xs,
  },
  chipsWrapper: {
    marginBottom: spacing.sm,
  },
  chipsScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  activeFilterNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  activeFilterNoticeText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  clearFilterInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  clearFilterInlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  featuredSection: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  featuredScrollContent: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  allRoomsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: 6,
  },
  allRoomsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  allRoomsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryText,
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
    color: colors.secondaryText,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  errorMessage: {
    fontSize: 13,
    color: colors.secondaryText,
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
    fontWeight: '700',
    fontSize: 14,
  },
});
