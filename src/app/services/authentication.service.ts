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
  private currentUser: User = new User();
  private tokenTimer: number;
  private isAuthenticated = false;
  private authenticationListener = new Subject<boolean>();
  private userListener = new Subject<User>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userService: UserService,
    private jwtHelperService: JwtHelperService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
    }
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  setIsAuthenticated(authenticated: boolean): void {
    this.isAuthenticated = authenticated;
  }

  getAuthenticationListener(): Observable<boolean> {
    return this.authenticationListener.asObservable();
  }

  setAuthenticationListener(authenticationListener): void {
    this.authenticationListener.next(authenticationListener);
  }

  getUserListener(): Observable<User> {
    return this.userListener.asObservable();
  }

  setUserListener(userListener): void {
    this.userListener.next(userListener);
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  signup(signupPayload: SignupPayload): void {
    this.httpClient.post(API_URL + '/signup', signupPayload).subscribe(
      () => {
        this.router.navigate(['login']);
      },
      (err) => {
        this.authenticationListener.next(false);
      }
    );
  }

  login(loginPayload: LoginPayload): void {
    this.userService.login(loginPayload).subscribe(
      (res) => {
        const token = res.token;
        if (token) {
          const decodedUser = this.decodeUserFromToken(token);
          decodedUser.subscribe(
            (settedUser) => this.setCurrentUser(settedUser),
            (err) => console.log(err)
          );
          const expiresInDuration = res.expiresIn;
          this.setAuthenticationTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authenticationListener.next(true);
          this.userListener.next(this.currentUser);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthenticationData(token, expirationDate, res.userId);
          this.router.navigate(['/']);
        }
      },
      (error) => this.authenticationListener.next(false)
    );
  }

  autoAuthentication(): void {
    const authInformation = this.getAuthenticationData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this.authenticationListener.next(true);
      this.setAuthenticationTimer(expiresIn / 1000);
      this.userListener.next(this.currentUser);
    }
  }

  logout(): void {
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
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthenticationData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthenticationData(): any {
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

  private getUserIdFromToken(token): string {
    const dataDecoded = this.jwtHelperService.decodeToken(token);

    if (dataDecoded) {
      return dataDecoded._id;
    }

    return null;
  }

  decodeUserFromToken(token: string): Observable<User> {
    const userId = this.getUserIdFromToken(token);

    if (userId) {
      return this.userService.getUser(userId);
    }

    return null;
  }

  setCurrentUser(decodedUser): void {
    this.isAuthenticated = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.firstName = decodedUser.firstName;
    this.currentUser.lastName = decodedUser.lastName;
    this.currentUser.email = decodedUser.email;
    this.currentUser.birthday = decodedUser.birthday;
  }
}
