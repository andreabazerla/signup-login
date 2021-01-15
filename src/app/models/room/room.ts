import { Beds } from './../../enums/room-type.enum';
import { Sex } from './../../../..//src/app/enums/sex.enum';
import { Occupation } from './../../../../src/app/enums/occupation.enum';

export class Room {
  _id?: string;
  title: string;
  description: string;
  price: number;
  surface: number;
  availability: Date;
  rooms: number;
  beds: Beds;
  roomMatesNumber: number;
  roomMatesSex: Sex;
  roomMatesType: Occupation;
  floor: number;
  window: boolean;
  animals: boolean;
  smokers: boolean;
  tags: String[];
}
