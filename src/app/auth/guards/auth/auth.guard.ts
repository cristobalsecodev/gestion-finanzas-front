import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { activateAccountRoute, loginRoute } from 'src/app/shared/constants/variables.constants';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {

  const tokenService = inject(TokenService)
  const notificationService = inject(NotificacionesService)
  const router = inject(Router)

  if(tokenService.isAuthenticated()) {

    if(!tokenService.isAccountActivated()) {

      notificationService.addNotification('You have to activate you account!', 'warning')

      router.navigate([activateAccountRoute])

      return false;

    }

    return true;

  } else {

    notificationService.addNotification('You are not logged!', 'warning')
    
    router.navigate([loginRoute])
    
    return false;

  }
};
