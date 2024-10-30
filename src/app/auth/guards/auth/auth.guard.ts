import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { activateAccountRoute, loginRoute } from 'src/app/shared/constants/variables.constants';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService)
  const notificationService = inject(NotificacionesService)
  const router = inject(Router)

  if(authService.isAuthenticated()) {

    if(authService.isAccountActivated()) {

      notificationService.addNotification('You have to activate you account!', 'warning')

      router.navigate([activateAccountRoute])

      return false;

    }

    return true;

  } else {

    router.navigate([loginRoute])

    notificationService.addNotification('You are not logged!', 'warning')

    return false;

  }
};
