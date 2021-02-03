import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Room } from 'src/app/models/room/room';
import { RoomsService } from 'src/app/services/rooms/rooms.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  title: string = 'Room';
  _id: string;
  room: Room;
  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private roomsService: RoomsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params) => {
      this._id = params['id'];
    });

    if (this._id) {
      this.getRoom(this._id);
    }
  }

  getRoom(_id) {
    this.roomsService.getRoom(_id).subscribe(
      room => this.room = room
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
