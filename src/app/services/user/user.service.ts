import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../../models/user/user.model';
import { LoginPayload } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  login(loginPayload: LoginPayload): Observable<any> {
    return this.httpClient.post('/api/login', loginPayload);
  }

  getUser(_id: string): Observable<User> {
    return this.httpClient.get<User>(`/api/user/${_id}`);
  }

  getHomeless(_id: string): Observable<User[]> {
    let httpParams = new HttpParams();

    if (_id) {
      httpParams.set('_id', _id);
    }

    return this.httpClient.get<User[]>('/api/homeless/', { params: httpParams });
  }
}
