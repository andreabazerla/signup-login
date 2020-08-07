import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, concat } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = '/api';
const AUTHENTICATION_URL = API_URL + '/authentication';

interface TokenResponse {
  token: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: number;
  birthday: Date;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;
  private authenticationListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  setIsAuthenticated(authenticated) {
    this.isAuthenticated = authenticated;
  }

  getAuthenticationListener() {
    return this.authenticationListener.asObservable();
  }

  setAuthenticationListener(authenticationListener) {
    this.authenticationListener.next(authenticationListener);
  }

  signup(signupPayload: SignupPayload) {
    this.httpClient
      .post(AUTHENTICATION_URL + '/signup', signupPayload)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (err) => {
          this.authenticationListener.next(false);
        }
      );
  }

  login(loginPayload: LoginPayload) {
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        AUTHENTICATION_URL + '/login',
        loginPayload
      )
      .subscribe(
        (res) => {
          const token = res.token;
          this.token = token;
          if (token) {
            const expiresInDuration = res.expiresIn;
            this.setAuthenticationTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = res.userId;
            this.authenticationListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthenticationData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (err) => {
          this.authenticationListener.next(false);
        }
      );
  }

  autoAuthentication() {
    const authInformation = this.getAuthenticationData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthenticationTimer(expiresIn / 1000);
      this.authenticationListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authenticationListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthenticationData();
    this.router.navigate(['/']);
  }

  private saveAuthenticationData(
    token: string,
    expirationDate: Date,
    userId: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthenticationData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthenticationData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }

  private setAuthenticationTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
