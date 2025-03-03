import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './auth/interceptors/AuthInterceptor/auth.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatIconRegistry } from '@angular/material/icon';
import { CurrencyExchangeService } from './shared/services/CurrencyExchange/currency-exchange.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD', // Valor almacenado y parseado
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Formato visual
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

export function initCurrencyService(service: CurrencyExchangeService) {
  return () => service.initialize()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])), 
    provideAnimationsAsync(),
    provideMomentDateAdapter(MY_FORMATS),
    {
      provide: APP_INITIALIZER,
      useFactory: (iconRegistry: MatIconRegistry) => {
        return () => {
          iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
        };
      },
      deps: [MatIconRegistry],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initCurrencyService,
      deps: [CurrencyExchangeService],
      multi: true
    }
  ]
};
