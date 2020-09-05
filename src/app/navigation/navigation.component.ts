import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userUsername: string;
  private authenticationSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthenticationService
  ) {}

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit() {
    this.userIsAuthenticated = this.authenticationService.getIsAuthenticated();
    this.authenticationSubscription = this.authenticationService
      .getAuthenticationListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.userUsername = this.authenticationService.getUserUsername();
  }

  ngOnDestroy() {
    this.authenticationSubscription.unsubscribe();
  }

  onLogout() {
    this.authenticationService.logout();
  }
}
