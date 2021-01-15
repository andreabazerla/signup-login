import { Occupation } from './../../src/app/enums/occupation.enum';
import * as mongoose from 'mongoose';

// Enums
import { Beds as Beds } from './../../src/app/enums/room-type.enum';
import { Sex } from './../../src/app/enums/sex.enum';

const RoomSchema: mongoose.Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  surface: Number,
  rooms: Number,
  availability: Date,
  beds: {
    type: Number,
    enum: [0,1,2]
  },
  roomMatesNumber: Number,
  roomMatesSex: {
    type: Number,
    enum: [0,1,2]
  },
  roomMatesType: {
    type: Number,
    enum: [0,1,2]
  },
  floor: Number,
  window: Boolean,
  animals: Boolean,
  smokers: Boolean,
  tags: [{
    type: String
  }]
});

export interface IRoom extends mongoose.Document {
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

// Methods

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
