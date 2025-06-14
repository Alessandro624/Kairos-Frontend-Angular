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
    const userRole = await firstValueFrom(authService.getUserRole());

    if (requiredRoles && requiredRoles.length > 0) {
      if (!userRole || !requiredRoles.includes(userRole[0].authority)) {
        console.log('AuthGuard: User authenticated but does not have required role. Redirecting to /403.');
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
