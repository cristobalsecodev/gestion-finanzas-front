import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './auth/interceptors/AuthInterceptor/auth.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD', // Acepta entrada en formato ISO
  },
  display: {
    dateInput: 'MMMM DD, YYYY', // Muestra "November 10, 2024" al usuario
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])), 
    provideAnimationsAsync(),
    provideMomentDateAdapter(MY_FORMATS)
  ]
};
