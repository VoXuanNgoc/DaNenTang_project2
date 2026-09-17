import { create } from 'zustand';
import { Booking, BookingInput } from '../types/booking';
import { initialMockBookings } from '../data/mockBookings';
import { checkBookingConflict } from '../utils/bookingUtils';

export interface BookingState {
  bookings: Booking[];
  // Filters for Browse screen
  searchQuery: string;
  selectedFilters: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  toggleFilter: (filter: string) => void;
  resetFilters: () => void;

  // Booking actions
  addBooking: (input: BookingInput) => {
    success: boolean;
    message: string;
    booking?: Booking;
  };
  cancelBooking: (bookingId: string) => void;

  // Selectors / Helpers
  isSlotBooked: (roomId: string, date: string, startTime: string, endTime: string) => boolean;
  getConfirmedBookingsCount: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: initialMockBookings,
  searchQuery: '',
  selectedFilters: ['All'],

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  toggleFilter: (filter: string) => {
    set((state) => {
      if (filter === 'All') {
        return { selectedFilters: ['All'] };
      }

      let newFilters = state.selectedFilters.filter((f) => f !== 'All');
      if (newFilters.includes(filter)) {
        newFilters = newFilters.filter((f) => f !== filter);
      } else {
        newFilters = [...newFilters, filter];
      }

      if (newFilters.length === 0) {
        newFilters = ['All'];
      }

      return { selectedFilters: newFilters };
    });
  },

  resetFilters: () => set({ searchQuery: '', selectedFilters: ['All'] }),

  addBooking: (input: BookingInput) => {
    const { bookings } = get();

    // Conflict prevention check
    const conflictResult = checkBookingConflict(
      bookings,
      input.roomId,
      input.date,
      input.startTime,
      input.endTime
    );

    if (conflictResult.hasConflict) {
      return {
        success: false,
        message: 'This time slot is already booked. Please choose another time.',
      };
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      roomId: input.roomId,
      roomName: input.roomName,
      building: input.building,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      studentName: input.studentName || 'Nguyen Van A',
      studentId: input.studentId || 'SV2024001',
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings],
    }));

    return {
      success: true,
      message: 'Booking confirmed successfully!',
      booking: newBooking,
    };
  },

  cancelBooking: (bookingId: string) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' as const } : booking
      ),
    }));
  },

  isSlotBooked: (roomId: string, date: string, startTime: string, endTime: string) => {
    const { bookings } = get();
    const conflict = checkBookingConflict(bookings, roomId, date, startTime, endTime);
    return conflict.hasConflict;
  },

  getConfirmedBookingsCount: () => {
    const { bookings } = get();
    return bookings.filter((b) => b.status === 'confirmed').length;
  },
}));
