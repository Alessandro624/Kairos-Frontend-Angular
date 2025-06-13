import {Routes} from '@angular/router';
import {Login} from './login/login';
import {AuthCallback} from './auth-callback/auth-callback';
import {Home} from './home/home';
import {ForgotPassword} from './forgot-password/forgot-password';
import {Register} from './register/register';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login', component: Login},
  {path: 'auth/callback', component: AuthCallback},
  {path: 'forgot-password', component: ForgotPassword},
  {path: 'register', component: Register},
  // TODO add admin/organizer/profile components, 404 e 403 for forbidden e not found
];
