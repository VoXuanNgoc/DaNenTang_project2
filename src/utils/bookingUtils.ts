import { Booking } from '../types/booking';

/**
 * Converts a time string in format "HH:mm" to total minutes from midnight.
 * e.g., "09:30" -> 570
 */
export const timeToMinutes = (timeStr: string): number => {
  const parts = timeStr.trim().split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: "${timeStr}". Expected "HH:mm".`);
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time values in "${timeStr}".`);
  }
  return hours * 60 + minutes;
};

/**
 * Checks if two time intervals [startA, endA) and [startB, endB) overlap.
 * Intervals sharing only an exact boundary (e.g. 09:00-10:00 and 10:00-11:00) do NOT overlap.
 */
export const doTimeIntervalsOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean => {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);

  if (sA >= eA || sB >= eB) {
    throw new Error('Start time must be strictly before end time.');
  }

  return sA < eB && sB < eA;
};

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: Booking;
  message?: string;
}

/**
 * Checks whether a requested booking conflicts with any existing confirmed bookings.
 * Cancelled bookings are ignored and do NOT block time slots.
 */
export const checkBookingConflict = (
  existingBookings: Booking[],
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): ConflictCheckResult => {
  const normalizedDate = date.trim();

  // Find any confirmed booking for the same room on the same date with overlapping time
  const conflictingBooking = existingBookings.find((booking) => {
    // Exclude if it's the same booking being edited/checked
    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }

    // Cancelled bookings never block time slots
    if (booking.status !== 'confirmed') {
      return false;
    }

    // Must match room and date
    if (booking.roomId !== roomId || booking.date !== normalizedDate) {
      return false;
    }

    // Check time overlap
    return doTimeIntervalsOverlap(booking.startTime, booking.endTime, startTime, endTime);
  });

  if (conflictingBooking) {
    return {
      hasConflict: true,
      conflictingBooking,
      message: `This time slot is already booked. Please choose another time. (Conflict with booking ${conflictingBooking.startTime} - ${conflictingBooking.endTime})`,
    };
  }

  return {
    hasConflict: false,
  };
};

/**
 * Formats date string YYYY-MM-DD to a user-friendly display date.
 * e.g. "2026-09-17" -> "Thu, Sep 17, 2026"
 */
export const formatDisplayDate = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
};

/**
 * Standard university slot schedule
 */
export const STANDARD_TIME_SLOTS = [
  { id: 'slot-1', startTime: '08:00', endTime: '09:00', label: '08:00 - 09:00' },
  { id: 'slot-2', startTime: '09:00', endTime: '10:00', label: '09:00 - 10:00' },
  { id: 'slot-3', startTime: '10:00', endTime: '11:00', label: '10:00 - 11:00' },
  { id: 'slot-4', startTime: '11:00', endTime: '12:00', label: '11:00 - 12:00' },
  { id: 'slot-5', startTime: '13:00', endTime: '14:00', label: '13:00 - 14:00' },
  { id: 'slot-6', startTime: '14:00', endTime: '15:00', label: '14:00 - 15:00' },
  { id: 'slot-7', startTime: '15:00', endTime: '16:00', label: '15:00 - 16:00' },
  { id: 'slot-8', startTime: '16:00', endTime: '17:00', label: '16:00 - 17:00' },
] as const;
