import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';
import { User } from './../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  user: User;

  private authenticationSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authenticationService: AuthenticationService,
    private userService: UserService,
    public matSnackBar: MatSnackBar
  ) {}

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.userIsAuthenticated = this.authenticationService.getIsAuthenticated();
    this.authenticationSubscription = this.authenticationService
      .getAuthenticationListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    // this.user = this.authenticationService.getCurrentUser();
    // this.userSubscription = this.authenticationService
    //   .getUserListener()
    //   .subscribe((user) => {
    //     if (this.userIsAuthenticated) {
    //       this.user = user;
    //     }
    //   });
  }

  openSnackBar(message: string, action: string): void {
    this.matSnackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.authenticationSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
