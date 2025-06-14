import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from './services';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';

export const authGuard: CanActivateFn = async (_route, _state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  try {
    const isAuthenticated = await firstValueFrom(authService.isAuthenticated());

    if (isAuthenticated) {
      return true;
    } else {
      authService.logout();
      console.log('Access denied. User is not authenticated. Redirecting to /401.');
      return router.createUrlTree(['/401']);
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
    authService.logout();
    return router.createUrlTree(['/401']);
  }
};
