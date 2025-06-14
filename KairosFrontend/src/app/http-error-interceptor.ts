import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './services';
import {catchError, throwError} from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error intercepted:', error);

      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']).then(() => console.log('Login redirect successful'));
        console.warn('(401). Logout successful. Redirecting to /login.');
      } else if (error.status === 403) {
        router.navigate(['/forbidden']).then(() => console.log('Access denied. Redirecting to /forbidden.'));
        console.warn('(403). Access denied. Redirecting to /forbidden.');
      } else if (error.status === 404) {
        router.navigate(['/not-found']).then(() => console.log('Resource not found. Redirecting to /not-found.'));
        console.warn('(404). Resource not found. Redirecting to /not-found.');
      }
      return throwError(() => error);
    })
  );
};
