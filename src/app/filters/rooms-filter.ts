import { RoomType } from '../enums/room-type.enum';

export interface RoomsFilter {
  minPrice: number;
  maxPrice: number;
  type: RoomType;
  window: boolean;
}
