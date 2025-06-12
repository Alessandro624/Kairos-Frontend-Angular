import {Routes} from '@angular/router';
import {Login} from './login/login';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: Login},
  // TODO add home, login, sign-in, forgot-password, admin/organizer/profile components, 404 e 403 for forbidden e not found
];
