import { useQuery } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import { Room } from '../types/room';

export const ROOM_QUERY_KEYS = {
  all: ['rooms'] as const,
  detail: (id: string) => ['rooms', id] as const,
};

/**
 * Hook to fetch all study rooms and labs with automatic caching
 */
export const useRooms = () => {
  return useQuery<Room[], Error>({
    queryKey: ROOM_QUERY_KEYS.all,
    queryFn: () => roomService.getRooms(),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
};

/**
 * Hook to fetch a single room by ID
 */
export const useRoom = (id: string) => {
  return useQuery<Room, Error>({
    queryKey: ROOM_QUERY_KEYS.detail(id),
    queryFn: () => roomService.getRoomById(id),
    enabled: Boolean(id),
  });
};
