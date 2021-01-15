import { Beds } from '../enums/room-type.enum';

export interface RoomsFilter {
  minPrice: number;
  maxPrice: number;
  type: Beds;
  window: boolean;
}
