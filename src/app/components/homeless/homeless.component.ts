import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from 'src/app/models/user/user.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-homeless',
  templateUrl: './homeless.component.html',
  styleUrls: ['./homeless.component.scss'],
})
export class HomelessComponent implements OnInit {
  title = 'Homeless';
  homeless: User[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    // this.userService.getHomeless('').subscribe({
    //   next: (homeless) => {
    //     this.homeless = homeless;
    //   }
    // })
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  toggleDrawer(matDrawer: MatDrawer) {
    const isSmallScreen = this.breakpointObserver.isMatched(
      '(max-width: 599px)'
    );
    if (isSmallScreen) {
      matDrawer.toggle();
    }
  }

  closeDrawer(matDrawer: MatDrawer): void {
    const isSmallScreen = this.breakpointObserver.isMatched(
      '(max-width: 599px)'
    );
    if (isSmallScreen) {
      matDrawer.close();
    }
  }
}
