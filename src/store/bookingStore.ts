import { create } from 'zustand';
import { Booking, BookingInput } from '../types/booking';
import { initialMockBookings } from '../data/mockBookings';
import { checkBookingConflict, isPastDate } from '../utils/bookingUtils';

export interface BookingState {
  bookings: Booking[];
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

  // Selectors
  isSlotBooked: (roomId: string, date: string, startTime: string, endTime: string) => boolean;
  getConfirmedBookingsCount: () => number;
}

export const CURRENT_STUDENT = {
  name: 'Võ Xuân Ngọc',
  studentId: '23IT180',
  email: 'voxuanngoc@example.com',
  role: 'Sinh viên',
  avatarLetter: 'N',
};

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: initialMockBookings,
  searchQuery: '',
  selectedFilters: ['Tất cả'],

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  toggleFilter: (filter: string) => {
    set((state) => {
      if (filter === 'Tất cả') {
        return { selectedFilters: ['Tất cả'] };
      }

      let newFilters = state.selectedFilters.filter((f) => f !== 'Tất cả');
      if (newFilters.includes(filter)) {
        newFilters = newFilters.filter((f) => f !== filter);
      } else {
        newFilters = [...newFilters, filter];
      }

      if (newFilters.length === 0) {
        newFilters = ['Tất cả'];
      }

      return { selectedFilters: newFilters };
    });
  },

  resetFilters: () => set({ searchQuery: '', selectedFilters: ['Tất cả'] }),

  addBooking: (input: BookingInput) => {
    // 1. Kiểm tra ngày
    if (!input.date || input.date.trim() === '') {
      return {
        success: false,
        message: 'Vui lòng chọn ngày đặt phòng.',
      };
    }

    // 2. Kiểm tra khung giờ
    if (!input.startTime || !input.endTime) {
      return {
        success: false,
        message: 'Vui lòng chọn khung giờ.',
      };
    }

    // 3. Kiểm tra ngày trong quá khứ
    if (isPastDate(input.date)) {
      return {
        success: false,
        message: 'Không thể đặt phòng cho ngày trong quá khứ.',
      };
    }

    const { bookings } = get();

    // 4. Kiểm tra xung đột thời gian (Conflict prevention)
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
        message: conflictResult.message || 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.',
      };
    }

    // Tạo mã booking ngẫu nhiên đẹp dạng BK-2026-XXXX
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `BK-2026-${randomCodeNum}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingCode,
      roomId: input.roomId,
      roomName: input.roomName,
      building: input.building || 'Khu giảng đường',
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      studentName: CURRENT_STUDENT.name,
      studentId: CURRENT_STUDENT.studentId,
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings],
    }));

    return {
      success: true,
      message: 'Đặt phòng thành công! 🎉',
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
