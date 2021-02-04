import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OverlayModule } from '@angular/cdk/overlay';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        OverlayModule,
        JwtModule.forRoot({
          config: {
            tokenGetter,
          },
        }),
      ],
      providers: [AuthenticationService, JwtHelperService, MatSnackBar, JwtModule],
    });
    authenticationService = TestBed.inject(AuthenticationService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });
});
