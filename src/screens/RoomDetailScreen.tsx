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
import { useBookingStore } from '../store/bookingStore';
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
  const { data: room, isLoading, isError, refetch } = useRoom(roomId);

  const bookings = useBookingStore((state) => state.bookings);
  const addBooking = useBookingStore((state) => state.addBooking);
  const isSlotBooked = useBookingStore((state) => state.isSlotBooked);

  // Generate next 7 days for the date selector
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      dates.push({ isoDate, dayName, dayNumber });
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

    if (!selectedDate) {
      Alert.alert('Date Required', 'Please choose a reservation date first.');
      return;
    }

    if (!selectedSlot) {
      Alert.alert('Time Slot Required', 'Please select a time slot to continue booking.');
      return;
    }

    // Call store booking action (which executes the conflict prevention engine)
    const result = addBooking({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      studentName: 'Nguyen Van A',
      studentId: 'SV2024001',
    });

    if (!result.success) {
      Alert.alert(
        'Booking Conflict',
        result.message || 'This time slot is already booked. Please choose another time.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Success confirmation dialog
    Alert.alert(
      'Booking Confirmed! 🎉',
      `Your reservation for ${room.name} on ${formatDisplayDate(selectedDate)} (${selectedSlot.label}) has been successfully confirmed.`,
      [
        {
          text: 'Book Another Slot',
          style: 'cancel',
          onPress: () => setSelectedSlotId(null),
        },
        {
          text: 'View My Bookings',
          onPress: () => {
            // Navigate to My Bookings tab
            navigation.getParent()?.navigate('MyBookingsTab');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading room details...</Text>
      </View>
    );
  }

  if (isError || !room) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.occupied} />
        <Text style={styles.errorTitle}>Room Not Found</Text>
        <TouchableOpacity style={styles.backButtonCenter} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Return to Browse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAvailable = room.status === 'available';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Large Room Image Banner */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: room.image }} style={styles.heroImage} resizeMode="cover" />

          {/* Floating Back Button */}
          <TouchableOpacity
            style={[styles.floatingBackButton, { top: insets.top + spacing.sm }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          {/* Overlaid Badges */}
          <View style={styles.imageOverlayBottom}>
            <View style={styles.typeBadge}>
              <Ionicons
                name={room.type === 'Lab' ? 'laptop-outline' : 'book-outline'}
                size={12}
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
                {isAvailable ? 'Available' : 'Occupied'}
              </Text>
            </View>
          </View>
        </View>

        {/* Room Information Card */}
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
              <Text style={styles.metaChipText}>{room.capacity} seats</Text>
            </View>
          </View>

          {/* Description */}
          {room.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this space</Text>
              <Text style={styles.descriptionText}>{room.description}</Text>
            </View>
          )}

          {/* Equipment / Amenities */}
          {room.equipment && room.equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Equipment & Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {room.equipment.map((item, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.available} />
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Date Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
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
                    activeOpacity={0.7}
                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                    onPress={() => setSelectedDate(item.isoDate)}
                    accessibilityRole="button"
                    accessibilityLabel={`Date ${item.dayName} ${item.dayNumber}`}
                  >
                    <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                      {item.dayName}
                    </Text>
                    <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                      {item.dayNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Slot Selector */}
          <View style={styles.section}>
            <View style={styles.timeHeaderRow}>
              <Text style={styles.sectionTitle}>Select Time Slot</Text>
              <Text style={styles.slotSubtitle}>
                {formatDisplayDate(selectedDate)}
              </Text>
            </View>

            {STANDARD_TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              // Check real-time conflict / booked state from Zustand
              const booked = isSlotBooked(
                room.id,
                selectedDate,
                slot.startTime,
                slot.endTime
              );

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

      {/* Floating Bottom Booking Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryLabel}>Selected Slot</Text>
          <Text style={styles.summaryValue} numberOfLines={1}>
            {selectedSlot ? selectedSlot.label : 'Choose a time slot'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedSlot || !selectedDate) && styles.bookButtonDisabled,
          ]}
          onPress={handleBookingSubmit}
          disabled={!selectedSlot || !selectedDate}
          accessibilityRole="button"
          accessibilityLabel="Confirm Room Reservation"
        >
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
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
    backgroundColor: '#E2E8F0',
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  typeBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
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
    fontSize: 12,
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
    marginBottom: spacing.sm,
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  amenitiesGrid: {
    gap: spacing.sm,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    height: 72,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: colors.white,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  dayNumberSelected: {
    color: colors.white,
  },
  timeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  slotSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
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
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  bookButtonDisabled: {
    backgroundColor: colors.cancelled,
    opacity: 0.6,
  },
  bookButtonText: {
    color: colors.white,
    fontWeight: '700',
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
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    fontWeight: '600',
  },
});
