import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

// Models
import { User } from './../models/user.model';

// Services
import { UserService } from './user.service';

// RxJS
import { Observable, Subject, concat } from 'rxjs';
import { map } from 'rxjs/operators';

// Costants
const API_URL = '/api';

// Interfaces
interface TokenResponse {
  token: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
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
  currentUser: User = new User();

  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userUsername: string;
  private isAuthenticated = false;
  private authenticationListener = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private jwtHelperService: JwtHelperService,
  ) {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   const decodedUser = this.decodeUserFromToken(token);
    //   this.setCurrentUser(decodedUser);
    // }
  }

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

  getUserUsername() {
    return this.userUsername;
  }

  signup(signupPayload: SignupPayload) {
    this.httpClient
      .post(API_URL + '/signup', signupPayload)
      .subscribe(
        () => {
          // TO-DO
          this.router.navigate(['login']);
        },
        (err) => {
          this.authenticationListener.next(false);
        }
      );
  }

  login(loginPayload: LoginPayload) {
    this.httpClient
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        userUsername: string;
      }>(API_URL + '/login', loginPayload)
      .subscribe(
        (res) => {
          const token = res.token;
          this.token = token;
          if (token) {
            // const decodedUser = this.decodeUserFromToken(token);
            // this.setCurrentUser(decodedUser);
            const expiresInDuration = res.expiresIn;
            this.setAuthenticationTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = res.userId;
            this.userUsername = res.userUsername;
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

  private getUserIdFromToken(token): String {
    const dataDecoded = this.jwtHelperService.decodeToken(token);

    if (dataDecoded) {
      return dataDecoded._id;
    }

    return null;
  }

  // decodeUserFromToken(token): object {
  //   const _id = this.getUserIdFromToken(token);

  //   if (_id) {
  //     this.userService.getUser(_id);
  //   }

  //   return null;
  // }

  setCurrentUser(decodedUser): void {
    this.isAuthenticated = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.firstName = decodedUser.firstName;
    this.currentUser.lastName = decodedUser.lastName;
    this.currentUser.email = decodedUser.email;
    this.currentUser.username = decodedUser.username;
    this.currentUser.birthday = decodedUser.birthday;
  }
}
