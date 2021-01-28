// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BrowseComponent } from './components/browse/browse.component';
import { FilterComponent } from './components/filter/filter.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Guards
import { ProfileGuard } from './guards/profile/profile.guard';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      // { path: '', component: ToolbarComponent },
      { path: 'home', component: HomeComponent },
      { path: 'browse', component: BrowseComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ProfileGuard],
      },
      {
        path: '',
        loadChildren: () =>
        import('./components/authentication/authentication.module').then(
          (m) => m.AuthenticationModule
          ),
        },
      ],
    },
  { path: 'filter', component: FilterComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
