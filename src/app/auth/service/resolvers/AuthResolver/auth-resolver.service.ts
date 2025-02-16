import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { activateAccountRoute, loginRoute } from 'src/app/shared/constants/variables.constants';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthResolverService {

  constructor(
    private tokenService: TokenService, 
    private router: Router,
    private notificationService: NotificacionesService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (this.tokenService.isTokenValid()) {

      if(!this.tokenService.isAccountActivated()) {

        this.notificationService.addNotification('You have to activate your account first!', 'warning')
        this.router.navigate([activateAccountRoute])
        return of(false)

      }

      return of(true)

    } else {

      this.router.navigate([loginRoute])
      return of(false)

    }
  }

}
