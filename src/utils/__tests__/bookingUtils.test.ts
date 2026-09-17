import { describe, it, expect } from '@jest/globals';
import {
  timeToMinutes,
  doTimeIntervalsOverlap,
  checkBookingConflict,
} from '../bookingUtils';
import { Booking } from '../../types/booking';

describe('Booking Conflict Prevention Engine', () => {
  describe('timeToMinutes', () => {
    it('converts HH:mm strings correctly to minutes from midnight', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('08:00')).toBe(480);
      expect(timeToMinutes('09:30')).toBe(570);
      expect(timeToMinutes('10:00')).toBe(600);
      expect(timeToMinutes('11:00')).toBe(660);
      expect(timeToMinutes('23:59')).toBe(1439);
    });

    it('throws error for invalid formats', () => {
      expect(() => timeToMinutes('invalid')).toThrow();
      expect(() => timeToMinutes('25:00')).toThrow();
      expect(() => timeToMinutes('10:65')).toThrow();
    });
  });

  describe('doTimeIntervalsOverlap', () => {
    const existingStart = '10:00';
    const existingEnd = '11:00';

    it('rejects left overlap (09:30 - 10:30 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('09:30', '10:30', existingStart, existingEnd)).toBe(true);
    });

    it('rejects exact match overlap (10:00 - 11:00 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('10:00', '11:00', existingStart, existingEnd)).toBe(true);
    });

    it('rejects right overlap (10:30 - 11:30 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('10:30', '11:30', existingStart, existingEnd)).toBe(true);
    });

    it('rejects inner interval overlap (10:15 - 10:45 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('10:15', '10:45', existingStart, existingEnd)).toBe(true);
    });

    it('rejects enclosing interval overlap (09:00 - 12:00 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('09:00', '12:00', existingStart, existingEnd)).toBe(true);
    });

    it('accepts strictly adjacent earlier time slot (09:00 - 10:00 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('09:00', '10:00', existingStart, existingEnd)).toBe(false);
    });

    it('accepts strictly adjacent later time slot (11:00 - 12:00 vs 10:00 - 11:00)', () => {
      expect(doTimeIntervalsOverlap('11:00', '12:00', existingStart, existingEnd)).toBe(false);
    });

    it('accepts non-adjacent completely separate slots', () => {
      expect(doTimeIntervalsOverlap('08:00', '09:00', existingStart, existingEnd)).toBe(false);
      expect(doTimeIntervalsOverlap('14:00', '15:00', existingStart, existingEnd)).toBe(false);
    });
  });

  describe('checkBookingConflict with existing bookings', () => {
    const existingBookings: Booking[] = [
      {
        id: 'booking-1',
        roomId: 'room-001',
        roomName: 'Lab A3-101',
        date: '2026-09-17',
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
      },
      {
        id: 'booking-2',
        roomId: 'room-001',
        roomName: 'Lab A3-101',
        date: '2026-09-17',
        startTime: '14:00',
        endTime: '15:00',
        status: 'cancelled', // Cancelled booking should NOT block
      },
      {
        id: 'booking-3',
        roomId: 'room-002',
        roomName: 'Library Zone B',
        date: '2026-09-17',
        startTime: '10:00',
        endTime: '11:00',
        status: 'confirmed',
      },
    ];

    it('rejects conflicting booking for same room, same date, overlapping time (09:30 - 10:30)', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-17', '09:30', '10:30');
      expect(result.hasConflict).toBe(true);
      expect(result.conflictingBooking?.id).toBe('booking-1');
      expect(result.message).toContain('already booked');
    });

    it('rejects exact time slot for same room and date (10:00 - 11:00)', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-17', '10:00', '11:00');
      expect(result.hasConflict).toBe(true);
      expect(result.conflictingBooking?.id).toBe('booking-1');
    });

    it('rejects overlapping time (10:30 - 11:30)', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-17', '10:30', '11:30');
      expect(result.hasConflict).toBe(true);
      expect(result.conflictingBooking?.id).toBe('booking-1');
    });

    it('accepts adjacent earlier slot (09:00 - 10:00)', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-17', '09:00', '10:00');
      expect(result.hasConflict).toBe(false);
      expect(result.conflictingBooking).toBeUndefined();
    });

    it('accepts adjacent later slot (11:00 - 12:00)', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-17', '11:00', '12:00');
      expect(result.hasConflict).toBe(false);
    });

    it('accepts time slot if existing booking is cancelled (14:00 - 15:00)', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-17', '14:00', '15:00');
      expect(result.hasConflict).toBe(false);
    });

    it('accepts same time slot on a DIFFERENT date', () => {
      const result = checkBookingConflict(existingBookings, 'room-001', '2026-09-18', '10:00', '11:00');
      expect(result.hasConflict).toBe(false);
    });

    it('accepts same time slot for a DIFFERENT room', () => {
      const result = checkBookingConflict(existingBookings, 'room-003', '2026-09-17', '10:00', '11:00');
      expect(result.hasConflict).toBe(false);
    });
  });
});
