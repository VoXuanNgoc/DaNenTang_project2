import { Booking } from '../types/booking';

export const getTodayDateString = (daysOffset: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialMockBookings: Booking[] = [
  {
    id: 'booking-seed-01',
    bookingCode: 'BK-2026-018',
    roomId: 'room-001',
    roomName: 'Lab A3-101',
    building: 'Tòa A3',
    date: getTodayDateString(0),
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    studentName: 'Võ Xuân Ngọc',
    studentId: '23IT180',
  },
  {
    id: 'booking-seed-02',
    bookingCode: 'BK-2026-042',
    roomId: 'room-004',
    roomName: 'Lab B2-202',
    building: 'Tòa B2',
    date: getTodayDateString(1),
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    studentName: 'Võ Xuân Ngọc',
    studentId: '23IT180',
  },
  {
    id: 'booking-seed-03',
    bookingCode: 'BK-2026-009',
    roomId: 'room-002',
    roomName: 'Library Zone B',
    building: 'Thư viện chính',
    date: getTodayDateString(-1),
    startTime: '09:00',
    endTime: '10:00',
    status: 'cancelled',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    studentName: 'Võ Xuân Ngọc',
    studentId: '23IT180',
  },
];
