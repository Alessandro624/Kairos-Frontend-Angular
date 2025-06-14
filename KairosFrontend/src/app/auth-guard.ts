import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from './services';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';

export const authGuard: CanActivateFn = async (route, _state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  try {
    const isAuthenticated = await firstValueFrom(authService.isAuthenticated());

    if (!isAuthenticated) {
      authService.logout();
      console.log('Access denied. User is not authenticated. Redirecting to /401.');
      return router.createUrlTree(['/401']);
    }

    const requiredRoles = route.data['roles'] as string[];
    const userRoles = authService.extractRoles(authService.getAccessToken())[0].authority;

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        console.log('AuthGuard: User does not have required roles. Redirecting to /403.');
        return router.createUrlTree(['/403']);
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    authService.logout();
    return router.createUrlTree(['/401']);
  }
};
