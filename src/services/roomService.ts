import { Room } from '../types/room';
import { Booking } from '../types/booking';
import { mockRooms } from '../data/mockRooms';
import { initialMockBookings } from '../data/mockBookings';

const SIMULATED_LATENCY_MS = 250;

/**
 * Mock API Service simulating backend REST endpoints
 */
export const roomService = {
  /**
   * Fetches all available campus study rooms and labs
   */
  async getRooms(): Promise<Room[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return [...mockRooms];
  },

  /**
   * Fetches details of a single room by its ID
   */
  async getRoomById(id: string): Promise<Room> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const room = mockRooms.find((r) => r.id === id);
    if (!room) {
      throw new Error(`Room with ID "${id}" was not found.`);
    }
    return { ...room };
  },

  /**
   * Fetches mock bookings
   */
  async getBookings(): Promise<Booking[]> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return [...initialMockBookings];
  },
};
