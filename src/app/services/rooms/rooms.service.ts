import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Models
import { Room } from './../../models/room/room';

// Services
import { GlobalsService } from '../globals/globals.service';

// Filters
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private API_URL: string;

  constructor(
    private httpClient: HttpClient,
    private globalsService: GlobalsService
  ) {
    this.API_URL = this.globalsService.API_URL;
  }

  getRooms(params): Observable<Room[]> {
    return this.httpClient.get<Room[]>(this.API_URL + '/rooms', { params });
  }
}
