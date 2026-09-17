export type RoomStatus = 'available' | 'occupied';

export type RoomType = 'Lab' | 'Study Room';

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  type: RoomType;
  status: RoomStatus;
  image: string;
  description?: string;
  equipment?: string[];
  floor?: string;
}
