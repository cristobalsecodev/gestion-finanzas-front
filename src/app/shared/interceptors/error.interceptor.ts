import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificacionesService } from '../services/Notifications/notificaciones.service';
import { inject } from '@angular/core';
import { DetailError } from '../interfaces/DetailError.interface';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const notificationService = inject(NotificacionesService)

  return next(req)
    .pipe(
      catchError((error) => {

        const detailedError: DetailError = error.error

        notificationService.addNotification(
          detailedError && detailedError.detail ? detailedError.detail : 'An error occurred while connecting to the server. Please try again.', 
          'error'
        )

        return throwError(() => detailedError)

      })
    )

};
