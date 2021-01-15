import { Component, OnInit } from '@angular/core';

// Models
import { Room } from './../../../../src/app/models/room/room';

// Services
import { RoomsService } from './../../services/rooms/rooms.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  rooms: Room[];

  constructor(private roomsService: RoomsService) {}

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms(): void {
    this.roomsService.getRooms(null)
      .subscribe(
        (rooms) => (this.rooms = rooms)
      );
  }
}
