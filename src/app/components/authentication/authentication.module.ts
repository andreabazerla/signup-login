import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from './../../material/angular-material.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [SignupComponent, LoginComponent, LogoutComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthenticationRoutingModule]
})
export class AuthenticationModule {}
