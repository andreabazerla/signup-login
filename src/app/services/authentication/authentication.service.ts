// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// RxJS
import { Observable, Subject } from 'rxjs';

// JWT Helper of Auth0
import { JwtHelperService } from '@auth0/angular-jwt';

// Models
import { User } from '../../models/user/user.model';

// Services
import { UserService } from '../user/user.service';
import { NotifierService } from '../notifier/notifier.service';
import { GlobalsService } from './../globals/globals.service';

// Luxon
import { DateTime } from 'luxon';

// Interfaces
export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  gender: number;
  birthday: Date;
  homeless: boolean
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface LocalStorage {
  token: string;
  expirationDate: DateTime;
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

  private API_URL: string;
  private TOKEN: string;
  private EXPIRATION: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private userService: UserService,
    private jwtHelperService: JwtHelperService,
    private notifierService: NotifierService,
    private globalsService: GlobalsService
  ) {
    this.API_URL = globalsService.API_URL;
    this.TOKEN = globalsService.TOKEN;
    this.EXPIRATION = globalsService.EXPIRATION;

    const token = localStorage.getItem(this.TOKEN);
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      decodedUser.subscribe((settedUser) => this.fillCurrentUser(settedUser));
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

  getUser(): User {
    const token = localStorage.getItem(this.TOKEN);
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      decodedUser.subscribe((settedUser) => this.fillCurrentUser(settedUser));
    }
    return this.currentUser;
  }

  signup(signupPayload: SignupPayload): void {
    this.httpClient.post(this.API_URL + '/signup', signupPayload).subscribe(
      (res: any) => {
        this.notifierService.add(res.message);

        this.router.navigate(['login']);
      },
      (err) => {
        this.notifierService.add(err.error.error.message);

        this.authenticationListener.next(false);
      }
    );
  }

  login(loginPayload: LoginPayload): void {
    this.httpClient
      .post('/api/login', loginPayload, {
        headers: { 'Content-type': 'application/json; charset=utf-8' },
      })
      .subscribe(
        (res: any) => {
          const success: boolean = res.success;
          if (success) {
            const token: string = res.token;
            if (token) {
              const decodedUser = this.decodeUserFromToken(token);
              if (decodedUser) {
                decodedUser.subscribe((settedUser) =>
                  this.fillCurrentUser(settedUser)
                );
              }

              const expiresInDuration = res.expiresIn;
              const expirationDate = DateTime.local().plus(
                expiresInDuration * 1000
              );

              this.setIsAuthenticated(true);
              this.authenticationListener.next(true);

              const localStorage: LocalStorage = {
                token,
                expirationDate,
              };
              this.saveAuthenticationData(localStorage);

              this.setAuthenticationTimer(expiresInDuration);

              this.notifierService.add(res.message);

              this.router.navigate(['']);
            }
          }
        },
        (err) => {
          this.notifierService.add(err.error.error.message);

          this.setIsAuthenticated(false);
          this.authenticationListener.next(false);
        }
      );
  }

  // TODO: Togliere utilizzo expireIn
  autoAuthentication(): void {
    const authenticationData = this.getAuthenticationData();
    if (!authenticationData) {
      return;
    }

    if (this.isLogged()) {
      this.setIsAuthenticated(true);
      this.authenticationListener.next(true);
      this.userListener.next(this.currentUser);

      const expiresIn = authenticationData.expirationDate.diffNow().valueOf() / 1000;
      this.setAuthenticationTimer(expiresIn);
    }
  }

  logout(): void {
    this.clearAuthenticationData();
    clearTimeout(this.tokenTimer);

    this.setIsAuthenticated(false);
    this.authenticationListener.next(false);

    this.notifierService.add('Logout successful');

    this.router.navigate(['/']);
  }

  private saveAuthenticationData(localStorageCustom: LocalStorage): void {
    localStorage.setItem(this.TOKEN, localStorageCustom.token);
    localStorage.setItem(
      this.EXPIRATION,
      localStorageCustom.expirationDate.valueOf()
    );
  }

  private clearAuthenticationData(): void {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.EXPIRATION);
  }

  // TODO: Togliere campo expirationDate
  private getAuthenticationData(): LocalStorage {
    const token = this.getLocalStorageFieldValue(this.TOKEN);
    const expirationDate = this.getLocalStorageFieldValue(
      this.EXPIRATION
    );

    let expirationDateNumber: number;
    if (expirationDate) {
      expirationDateNumber = parseInt(expirationDate, 10);
    }

    if (!token || !expirationDate) {
      return null;
    }

    return {
      token,
      expirationDate: DateTime.fromMillis(expirationDateNumber),
    };
  }

  private setAuthenticationTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getUserIdFromToken(token): string {
    const dataDecoded = this.jwtHelperService.decodeToken(token);

    if (dataDecoded) {
      return dataDecoded.sub;
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

  fillCurrentUser(decodedUser): void {
    this.setIsAuthenticated(true);
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.firstName = decodedUser.firstName;
    this.currentUser.lastName = decodedUser.lastName;
    this.currentUser.email = decodedUser.email;
    this.currentUser.birthday = decodedUser.birthday;
    this.currentUser.homeless = decodedUser.homeless;
  }

  private getLocalStorageFieldValue(field: string): string {
    const fieldValue = localStorage.getItem(field);
    return fieldValue;
  }

  public getBearerToken(): string {
    return this.getLocalStorageFieldValue(this.TOKEN);
  }

  public isLogged(): boolean {
    const bearerToken = this.getBearerToken();
    return !this.jwtHelperService.isTokenExpired(bearerToken);
  }

  // TODO: to delete?
  // private buildLocalStorageField(field: string, fieldValue: string): object {
  //   const stringsArray = new Array(field, fieldValue);
  //   return JSON.parse('{ ' + stringsArray.join(': ') + ' }');
  // }
}
