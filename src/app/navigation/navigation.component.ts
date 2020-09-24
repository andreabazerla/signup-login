import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthenticationService } from './../services/authentication.service';
import { UserService } from './../services/user.service';
import { User } from './../models/user.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isLoading = true;
  userIsAuthenticated = false;
  user: User;

  private authenticationSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authenticationService: AuthenticationService,
    private userService: UserService
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

    this.user = this.authenticationService.getCurrentUser();
    this.userSubscription = this.authenticationService
    .getUserListener()
    .subscribe((user) => {
      if (this.userIsAuthenticated) {
        this.user = user;
      }
    });

    // this.getUser();
  }

  getUser(): void {
    if (this.authenticationService.getCurrentUser()) {
      this.userService
        .getUser(this.authenticationService.getCurrentUser()._id)
        .subscribe(
          user => this.user = user,
          error => console.log(error),
          () => this.isLoading = false
        );
    }
  }

  ngOnDestroy(): void {
    this.authenticationSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
