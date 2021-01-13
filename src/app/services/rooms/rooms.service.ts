import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Models
import { Room } from './../../models/room/room';

// Services
import { GlobalsService } from '../globals/globals.service';
import { NotifierService } from './../notifier/notifier.service';

// Filters
import { RoomsFilter } from './../../../../src/app/filters/rooms-filter';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private API_URL: string;

  constructor(
    private httpClient: HttpClient,
    private globalsService: GlobalsService
  ) {
    this.API_URL = globalsService.API_URL;
  }

  getRooms(roomFilter: RoomsFilter): Observable<Room[]> {
    return this.httpClient.get<Room[]>(this.API_URL + '/rooms');
  }
}
