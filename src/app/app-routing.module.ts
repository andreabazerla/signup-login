// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BrowseComponent } from './components/browse/browse.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Guards
import { ProfileGuard } from './guards/profile/profile.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    loadChildren: () =>
      import('./components/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: 'home', component: HomeComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
