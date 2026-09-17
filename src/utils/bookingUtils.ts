import { Booking } from '../types/booking';

/**
 * Chuyển đổi định dạng "HH:mm" thành tổng số phút tính từ 00:00.
 */
export const timeToMinutes = (timeStr: string): number => {
  const parts = timeStr.trim().split(':');
  if (parts.length !== 2) {
    throw new Error(`Định dạng giờ không hợp lệ: "${timeStr}". Yêu cầu định dạng "HH:mm".`);
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Giá trị giờ phút không hợp lệ trong "${timeStr}".`);
  }
  return hours * 60 + minutes;
};

/**
 * Kiểm tra xem 2 khoảng thời gian [startA, endA) và [startB, endB) có bị chồng lấn (overlap) hay không.
 * Điều kiện trùng lịch: startA < endB && startB < endA
 * Các khoảng chạm ranh giới (ví dụ 09:00 - 10:00 và 10:00 - 11:00) KHÔNG bị tính là trùng.
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
    throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc.');
  }

  return sA < eB && sB < eA;
};

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: Booking;
  message?: string;
}

/**
 * Kiểm tra xem ngày có phải là ngày trong quá khứ hay không.
 */
export const isPastDate = (dateStr: string): boolean => {
  const [year, month, day] = dateStr.split('-').map((v) => parseInt(v, 10));
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return targetDate.getTime() < today.getTime();
};

/**
 * Kiểm tra xung đột lịch đặt phòng.
 * Chỉ các booking "confirmed" mới gây xung đột.
 * Booking "cancelled" không bao giờ chặn khung giờ.
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

  const conflictingBooking = existingBookings.find((booking) => {
    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }

    // Chỉ kiểm tra booking có trạng thái confirmed
    if (booking.status !== 'confirmed') {
      return false;
    }

    // Cùng phòng và cùng ngày
    if (booking.roomId !== roomId || booking.date !== normalizedDate) {
      return false;
    }

    // Kiểm tra overlap thời gian
    return doTimeIntervalsOverlap(booking.startTime, booking.endTime, startTime, endTime);
  });

  if (conflictingBooking) {
    return {
      hasConflict: true,
      conflictingBooking,
      message: 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.',
    };
  }

  return {
    hasConflict: false,
  };
};

/**
 * Định dạng ngày YYYY-MM-DD sang tiếng Việt thân thiện (ví dụ: "Thứ Năm, 17/09/2026")
 */
export const formatDisplayDate = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      
      const dayOfWeekNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = dayOfWeekNames[date.getDay()];
      const pad = (n: number) => String(n).padStart(2, '0');
      
      return `${dayName}, ${pad(day)}/${pad(month + 1)}/${year}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
};

/**
 * Danh sách 8 khung giờ học chuẩn tại trường đại học
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
