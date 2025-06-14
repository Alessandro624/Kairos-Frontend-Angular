import {Routes} from '@angular/router';
import {Login} from './login/login';
import {AuthCallback} from './auth-callback/auth-callback';
import {Home} from './home/home';
import {ForgotPassword} from './forgot-password/forgot-password';
import {Register} from './register/register';
import {Profile} from './profile/profile';
import {NotFound} from './not-found/not-found';
import {Unauthorized} from './unauthorized/unauthorized';
import {authGuard} from './auth-guard';
import {Forbidden} from './forbidden/forbidden';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login', component: Login},
  {path: 'auth/callback', component: AuthCallback},
  {path: 'forgot-password', component: ForgotPassword},
  {path: 'register', component: Register},
  {path: 'profile', component: Profile, canActivate: [authGuard]},
  {path: '401', component: Unauthorized},
  {path: '403', component: Forbidden},
  {path: '404', component: NotFound},
  {path: '**', redirectTo: '/404'}
];
