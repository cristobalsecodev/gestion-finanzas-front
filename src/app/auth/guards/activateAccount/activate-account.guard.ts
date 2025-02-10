import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { incomeExpensesRoute, loginRoute } from 'src/app/shared/constants/variables.constants';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

export const activateAccountGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService)
  const notificationService = inject(NotificacionesService)
  const router = inject(Router)

  if(tokenService.isAuthenticated()) {

    if(tokenService.isAccountActivated()) {

      notificationService.addNotification('So... double-checking, just to be on the safe side?', 'info')
      
      router.navigate([incomeExpensesRoute])

      return false;

    }

    return true;

  } else {

    notificationService.addNotification('You are not logged!', 'warning')

    router.navigate([loginRoute])

    return false;

  }

};
