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

        notificationService.addNotification(statusError(error.status), 'error')

        console.error(errorMessage)

        return throwError(() => error)

      })
    )

};

function statusError(status: number): string {

  switch(status) {
    case 0:

      return 'Unable to connect with the server'
    
    default:
      return 'Something really wrong happened'
  }

}