export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  bookingCode: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  createdAt: string;
  studentName: string;
  studentId: string;
}

export interface BookingInput {
  roomId: string;
  roomName: string;
  building?: string;
  date: string;
  startTime: string;
  endTime: string;
  studentName?: string;
  studentId?: string;
}
