import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { inject } from '@angular/core';
import { resumeRoute } from 'src/app/shared/constants/variables.constants';

export const actuallyLoggedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const notificationService = inject(NotificacionesService)
  const router = inject(Router)

  if(authService.isAuthenticated()) {

    router.navigate([resumeRoute])

    notificationService.addNotification('You are actually logged!', 'info')

    return false;

  } else {

    return true;

  }

};
