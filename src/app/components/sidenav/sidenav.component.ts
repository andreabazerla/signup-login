import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { User } from '../../models/user/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  user: User;

  private authenticationSubscription$: Subscription;

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
    if (this.authenticationSubscription$) {
      this.authenticationSubscription$.unsubscribe();
    }
  }
}
