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
  horizontal?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(({
  room,
  onPress,
  horizontal = false,
}) => {
  const isAvailable = room.status === 'available';

  if (horizontal) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.horizontalCard}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${room.name}, ${room.type}, ${room.building}, sức chứa ${room.capacity} chỗ, ${isAvailable ? 'Còn trống' : 'Đang được sử dụng'}`}
      >
        <View style={styles.horizontalImageContainer}>
          <Image
            source={{ uri: room.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.typeBadge}>
            <Ionicons
              name={room.type.includes('Lab') ? 'laptop-outline' : 'book-outline'}
              size={11}
              color={colors.white}
            />
            <Text style={styles.typeText}>{room.type}</Text>
          </View>
        </View>

        <View style={styles.horizontalContent}>
          <View
            style={[
              styles.statusBadge,
              isAvailable ? styles.statusAvailableBg : styles.statusOccupiedBg,
              styles.statusBadgeSmall,
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

          <Text style={styles.horizontalRoomName} numberOfLines={1}>
            {room.name}
          </Text>

          <View style={styles.horizontalMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={13} color={colors.secondaryText} />
              <Text style={styles.metaText} numberOfLines={1}>
                {room.building}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={13} color={colors.secondaryText} />
              <Text style={styles.metaText}>{room.capacity} chỗ</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, ${room.type}, ${room.building}, sức chứa ${room.capacity} chỗ, ${isAvailable ? 'Còn trống' : 'Đang được sử dụng'}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Room Type Badge */}
        <View style={styles.typeBadge}>
          <Ionicons
            name={room.type.includes('Lab') ? 'laptop-outline' : 'book-outline'}
            size={12}
            color={colors.white}
          />
          <Text style={styles.typeText}>{room.type}</Text>
        </View>

        {/* Status Badge */}
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

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
          <View style={styles.chevronWrapper}>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={14} color={colors.primary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {room.building}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={colors.secondaryText} />
            <Text style={styles.metaText}>{room.capacity} chỗ ngồi</Text>
          </View>

          {room.floor && (
            <View style={styles.metaItem}>
              <Ionicons name="layers-outline" size={14} color={colors.secondaryText} />
              <Text style={styles.metaText}>{room.floor}</Text>
            </View>
          )}
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
    ...shadows.sm,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: colors.primaryLight,
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
    backgroundColor: 'rgba(37, 33, 58, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  typeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  statusBadgeSmall: {
    position: 'relative',
    top: 0,
    right: 0,
    alignSelf: 'flex-start',
    marginBottom: 6,
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
    fontSize: 11,
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
  chevronWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '500',
  },

  // Horizontal card variant for Featured Section
  horizontalCard: {
    width: 250,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  horizontalImageContainer: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.primaryLight,
  },
  horizontalContent: {
    padding: spacing.md,
  },
  horizontalRoomName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  horizontalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
