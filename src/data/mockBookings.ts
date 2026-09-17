import { Booking } from '../types/booking';

// Helper to get formatted ISO date string YYYY-MM-DD
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
    roomId: 'room-001',
    roomName: 'Lab A3-101',
    building: 'Building A3',
    date: getTodayDateString(0),
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    studentName: 'Nguyen Van A',
    studentId: 'SV2024001',
  },
  {
    id: 'booking-seed-02',
    roomId: 'room-006',
    roomName: 'Group Collab Room A3',
    building: 'Building A3',
    date: getTodayDateString(1),
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    studentName: 'Nguyen Van A',
    studentId: 'SV2024001',
  },
  {
    id: 'booking-seed-03',
    roomId: 'room-002',
    roomName: 'Library Zone B',
    building: 'Main Library',
    date: getTodayDateString(-1),
    startTime: '09:00',
    endTime: '10:00',
    status: 'cancelled',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    studentName: 'Nguyen Van A',
    studentId: 'SV2024001',
  },
];
