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

        let detailedError: DetailError = error.error

        notificationService.addNotification(detailedError.detail, 'error')

        return throwError(() => detailedError)

      })
    )

};
