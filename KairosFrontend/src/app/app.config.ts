import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {ApiModule, Configuration} from './services';
import {API_BASE_PATH} from '../environments/environment';
import {httpErrorInterceptor} from './http-error-interceptor';
import {Profile} from './profile/profile';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    importProvidersFrom(
      ApiModule.forRoot(() => new Configuration({
        basePath: API_BASE_PATH,
        accessToken: localStorage.getItem('token')?.toString() || '',
      }))
    ), Profile
  ]
};
