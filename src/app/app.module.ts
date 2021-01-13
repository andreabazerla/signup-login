import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material module
import { AngularMaterialModule } from './material/angular-material.module';

// Components
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Interceptors
import { AuthorizationInterceptor } from './interceptors/authorization/authorization.interceptor';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';

// Services
import { GlobalsService } from './services/globals/globals.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserService } from './services/user/user.service';
import { RoomsService } from './services/rooms/rooms.service';
import { NotifierService } from './services/notifier/notifier.service';
import { ErrorService } from './services/error/error.service';
import { LoggingService } from './services/logging/logging.service';

// Handlers
import { ErrorsHandler } from './handlers/error.handler.';
import { BrowseComponent } from './components/browse/browse.component';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent,
    BrowseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
      },
    }),
  ],
  providers: [
    GlobalsService,
    AuthenticationService,
    UserService,
    RoomsService,
    NotifierService,
    ErrorService,
    LoggingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorsHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
