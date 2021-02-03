import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../models/user/user.model';
import { LoginPayload } from '../authentication/authentication.service';
import { GlobalsService } from '../globals/globals.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL: string;

  constructor(
    private httpClient: HttpClient,
    private globalsService: GlobalsService
  ) {
    this.API_URL = this.globalsService.API_URL;
  }

  getUser(_id: string): Observable<User> {
    return this.httpClient.get<User>(this.API_URL + `/user/${_id}`);
  }

  login(loginPayload: LoginPayload): Observable<any> {
    return this.httpClient.post(this.API_URL + '/login/', loginPayload);
  }
}
