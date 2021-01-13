import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  user: User;

  private authenticationSubscription$: Subscription;
  private userSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authenticationService: AuthenticationService,
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
    this.authenticationSubscription$ = this.authenticationService
      .getAuthenticationListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  toggle(matSidenav: MatSidenav) {
    const isSmallScreen = this.breakpointObserver.isMatched(
      '(max-width: 599px)'
    );
    if (isSmallScreen) {
      matSidenav.toggle();
    }
  }

  ngOnDestroy(): void {
    this.authenticationSubscription$.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
