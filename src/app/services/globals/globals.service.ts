import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  readonly token: string = 'token';
  readonly expiration: string = 'expiration';

  constructor() {}
}
