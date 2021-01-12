import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  AuthenticationService,
  LoginPayload,
} from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(public authenticationService: AuthenticationService) {}

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    const loginPayload: LoginPayload = {
      email,
      password,
    };

    this.authenticationService.login(loginPayload);
  }
}
