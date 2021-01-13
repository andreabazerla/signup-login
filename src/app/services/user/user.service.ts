import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../models/user/user.model';
import { LoginPayload } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUser(_id: string): Observable<User> {
    return this.httpClient.get<User>(`/api/user/${_id}`);
  }

  login(loginPayload: LoginPayload): Observable<any> {
    return this.httpClient.post('/api/login', loginPayload);
  }
}
