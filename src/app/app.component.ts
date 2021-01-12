import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  appName = 'Affittagram';

  constructor(
    private authenticationService: AuthenticationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authenticationService.autoAuthentication();
  }

  // This fixes: https://github.com/DavideViolante/Angular-Full-Stack/issues/105
  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }
}
