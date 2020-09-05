import { AuthenticationService } from './../../services/authentication.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import { User } from './../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User;
  isLoading = true;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    // this.userService.getUser(this.authenticationService.currentUser).subscribe(
    //   (data) => (this.user = data),
    //   (error) => console.log(error),
    //   () => (this.isLoading = false)
    // );
  }
}
