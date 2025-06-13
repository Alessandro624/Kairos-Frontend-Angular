import {Routes} from '@angular/router';
import {Login} from './login/login';
import {AuthCallback} from './auth-callback/auth-callback';
import {Home} from './home/home';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login', component: Login},
  {path: 'auth/callback', component: AuthCallback},
  // TODO add sign-in, forgot-password, admin/organizer/profile components, 404 e 403 for forbidden e not found
];
