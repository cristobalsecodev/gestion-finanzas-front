import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificacionesService } from '../services/Notifications/notificaciones.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const notificationService = inject(NotificacionesService)

  return next(req)
    .pipe(
      catchError((error) => {

        const errorMessage = error.error.message || error.statusText

        notificationService.addNotification(errorMessage, 'error')

        console.error(errorMessage)

        return throwError(() => error)

      })
    )

};
