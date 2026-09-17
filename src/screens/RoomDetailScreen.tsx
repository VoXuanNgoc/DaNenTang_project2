import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrowseStackScreenProps } from '../navigation/types';
import { useRoom } from '../hooks/useRooms';
import { useBookingStore, CURRENT_STUDENT } from '../store/bookingStore';
import { TimeSlot } from '../components/TimeSlot';
import { STANDARD_TIME_SLOTS, formatDisplayDate } from '../utils/bookingUtils';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';

export const RoomDetailScreen: React.FC<BrowseStackScreenProps<'RoomDetail'>> = ({
  route,
  navigation,
}) => {
  const { roomId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: room, isLoading, isError } = useRoom(roomId);

  const addBooking = useBookingStore((state) => state.addBooking);
  const isSlotBooked = useBookingStore((state) => state.isSlotBooked);

  // Tạo danh sách 7 ngày tới (không cho chọn ngày quá khứ)
  const availableDates = useMemo(() => {
    const dates = [];
    const vietnameseDayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      const dayName = i === 0 ? 'Hôm nay' : vietnameseDayNames[d.getDay()];
      const dayNumber = d.getDate();
      const monthNumber = d.getMonth() + 1;
      dates.push({ isoDate, dayName, dayNumber, monthNumber });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.isoDate || '');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectedSlot = useMemo(() => {
    return STANDARD_TIME_SLOTS.find((s) => s.id === selectedSlotId);
  }, [selectedSlotId]);

  const handleBookingSubmit = () => {
    if (!room) return;

    // 1. Kiểm tra ngày
    if (!selectedDate || selectedDate.trim() === '') {
      Alert.alert('Chưa chọn ngày', 'Vui lòng chọn ngày đặt phòng.', [{ text: 'Đã hiểu' }]);
      return;
    }

    // 2. Kiểm tra khung giờ
    if (!selectedSlot) {
      Alert.alert('Chưa chọn khung giờ', 'Vui lòng chọn khung giờ.', [{ text: 'Đã hiểu' }]);
      return;
    }

    // Gọi store booking action với logic kiểm tra overlap chống trùng lịch
    const result = addBooking({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      studentName: CURRENT_STUDENT.name,
      studentId: CURRENT_STUDENT.studentId,
    });

    if (!result.success) {
      Alert.alert(
        'Trùng lịch đặt phòng',
        result.message || 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.',
        [{ text: 'Chọn giờ khác' }]
      );
      return;
    }

    // Nếu hợp lệ, mở màn hình xác nhận BookingConfirmationScreen
    if (result.booking) {
      navigation.navigate('BookingConfirmation', { booking: result.booking });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải thông tin chi tiết phòng...</Text>
      </View>
    );
  }

  if (isError || !room) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.occupied} />
        <Text style={styles.errorTitle}>Không tìm thấy phòng</Text>
        <TouchableOpacity style={styles.backButtonCenter} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAvailable = room.status === 'available';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* Ảnh phòng lớn */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: room.image }} style={styles.heroImage} resizeMode="cover" />

          {/* Nút quay lại floating */}
          <TouchableOpacity
            style={[styles.floatingBackButton, { top: insets.top + spacing.sm }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Badges trên ảnh */}
          <View style={styles.imageOverlayBottom}>
            <View style={styles.typeBadge}>
              <Ionicons
                name={room.type.includes('Lab') ? 'laptop-outline' : 'book-outline'}
                size={13}
                color={colors.white}
              />
              <Text style={styles.typeBadgeText}>{room.type}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                isAvailable ? styles.statusAvailableBg : styles.statusOccupiedBg,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isAvailable ? styles.dotAvailable : styles.dotOccupied,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  isAvailable ? styles.statusAvailableText : styles.statusOccupiedText,
                ]}
              >
                {isAvailable ? 'Còn trống' : 'Đang được sử dụng'}
              </Text>
            </View>
          </View>
        </View>

        {/* Thông tin phòng học */}
        <View style={styles.body}>
          <Text style={styles.roomName}>{room.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="business-outline" size={15} color={colors.primary} />
              <Text style={styles.metaChipText}>{room.building}</Text>
            </View>

            {room.floor && (
              <View style={styles.metaChip}>
                <Ionicons name="layers-outline" size={15} color={colors.primary} />
                <Text style={styles.metaChipText}>{room.floor}</Text>
              </View>
            )}

            <View style={styles.metaChip}>
              <Ionicons name="people-outline" size={15} color={colors.primary} />
              <Text style={styles.metaChipText}>{room.capacity} chỗ ngồi</Text>
            </View>
          </View>

          {/* 7. Mô tả phòng */}
          {room.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả phòng học</Text>
              <Text style={styles.descriptionText}>{room.description}</Text>
            </View>
          )}

          {/* 8. Tiện ích phòng */}
          {(room.amenities || room.equipment) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tiện ích & Trang thiết bị</Text>
              <View style={styles.amenitiesGrid}>
                {(room.amenities || room.equipment || []).map((item, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <View style={styles.amenityCheckCircle}>
                      <Ionicons name="checkmark" size={12} color={colors.white} />
                    </View>
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 9. Khu vực chọn ngày */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Chọn ngày học</Text>
              <Text style={styles.selectedDateHint}>{formatDisplayDate(selectedDate)}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateSelector}
            >
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.isoDate;
                return (
                  <TouchableOpacity
                    key={item.isoDate}
                    activeOpacity={0.75}
                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                    onPress={() => {
                      setSelectedDate(item.isoDate);
                      setSelectedSlotId(null); // Reset slot khi đổi ngày
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Ngày ${item.dayName}, ngày ${item.dayNumber}`}
                  >
                    <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                      {item.dayName}
                    </Text>
                    <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                      {item.dayNumber}
                    </Text>
                    <Text style={[styles.dayMonth, isSelected && styles.dayMonthSelected]}>
                      Th{item.monthNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 10. Khu vực chọn khung giờ */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Chọn khung giờ</Text>
              <View style={styles.liveIndicatorBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveIndicatorText}>Trực tiếp</Text>
              </View>
            </View>

            {STANDARD_TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const booked = isSlotBooked(room.id, selectedDate, slot.startTime, slot.endTime);

              return (
                <TimeSlot
                  key={slot.id}
                  startTime={slot.startTime}
                  endTime={slot.endTime}
                  label={slot.label}
                  isSelected={isSelected}
                  isBooked={booked}
                  onSelect={() => setSelectedSlotId(slot.id)}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 11. Thanh nút Đặt phòng cố định phía dưới */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Khung giờ đã chọn</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {selectedSlot ? selectedSlot.label : 'Chưa chọn khung giờ'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedSlot || !selectedDate) && styles.bookButtonDisabled,
          ]}
          onPress={handleBookingSubmit}
          disabled={!selectedSlot || !selectedDate}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Xác nhận đặt phòng"
        >
          <Text style={styles.bookButtonText}>Đặt phòng</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageWrapper: {
    height: 270,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.primaryLight,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBackButton: {
    position: 'absolute',
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  imageOverlayBottom: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: 'rgba(37, 33, 58, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  typeBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  statusAvailableBg: {
    backgroundColor: colors.availableBg,
    borderColor: colors.availableBorder,
  },
  statusOccupiedBg: {
    backgroundColor: colors.occupiedBg,
    borderColor: colors.occupiedBorder,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotAvailable: {
    backgroundColor: colors.available,
  },
  dotOccupied: {
    backgroundColor: colors.occupied,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusAvailableText: {
    color: colors.available,
  },
  statusOccupiedText: {
    color: colors.occupied,
  },
  body: {
    padding: spacing.md,
  },
  roomName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  metaChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  selectedDateHint: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  liveIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.secondaryText,
    marginTop: 4,
  },
  amenitiesGrid: {
    gap: spacing.sm,
    marginTop: 4,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amenityCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.available,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  dateSelector: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dateCard: {
    width: 68,
    height: 76,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryText,
    marginBottom: 2,
  },
  dayNameSelected: {
    color: colors.accent,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  dayNumberSelected: {
    color: colors.white,
  },
  dayMonth: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dayMonthSelected: {
    color: colors.primaryLight,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.lg,
  },
  summaryCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonDisabled: {
    backgroundColor: colors.cancelled,
    opacity: 0.5,
    elevation: 0,
  },
  bookButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  backButtonCenter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
});
