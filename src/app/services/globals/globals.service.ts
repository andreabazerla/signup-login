import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {

  readonly API_URL: string = '/api';

  readonly TOKEN: string = 'token';
  readonly EXPIRATION: string = 'expiration';

  constructor() {}
}
