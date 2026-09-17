import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../types/room';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';

interface RoomCardProps {
  room: Room;
  onPress: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(({ room, onPress }) => {
  const isAvailable = room.status === 'available';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, ${room.type}, located in ${room.building}, capacity ${room.capacity}, currently ${room.status}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Room Type Overlay Badge */}
        <View style={styles.typeBadge}>
          <Ionicons
            name={room.type === 'Lab' ? 'laptop-outline' : 'book-outline'}
            size={12}
            color={colors.white}
          />
          <Text style={styles.typeText}>{room.type}</Text>
        </View>

        {/* Status Indicator Badge */}
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

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>

        <View style={styles.metaRow}>
          {/* Building */}
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {room.building}
            </Text>
          </View>

          {/* Capacity */}
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{room.capacity} seats</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.md,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  typeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
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
    width: 7,
    height: 7,
    borderRadius: 3.5,
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
  content: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
