import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { loginRoute, resumeRoute } from 'src/app/shared/constants/variables.constants';
import { AuthService } from 'src/app/auth/service/auth.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';

export const activateAccountGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const notificationService = inject(NotificacionesService)
  const router = inject(Router)

  if(authService.isAuthenticated()) {

    if(authService.isAccountActivated()) {

      router.navigate([resumeRoute])

      notificationService.addNotification('So... double-checking, just to be on the safe side?', 'info')

      return false;

    }

    return true;

  } else {

    router.navigate([loginRoute])

    return false;

  }

};
