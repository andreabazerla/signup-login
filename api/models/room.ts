import * as mongoose from 'mongoose';

import { RoomType } from './../../src/app/enums/room-type.enum';

const RoomSchema: mongoose.Schema = new mongoose.Schema({
  price: {
    type: Number
  },
  rooms: {
    type: Number,
    enum: [0,1,2],
    required: true
  },
  window: {
    type: Boolean
  }
});

export interface IRoom extends mongoose.Document {
  price: number;
  rooms: RoomType;
  window: boolean;
}

// Methods

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
