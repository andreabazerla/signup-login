import { RoomType } from './../../enums/room-type.enum';

export class Room {
  _id?: string;
  price: number;
  type: RoomType;
  window: boolean;
}
