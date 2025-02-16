import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateAccountResolverService {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private notificationService: NotificacionesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if(this.tokenService.isAuthenticated()) {

      if(this.tokenService.isAccountActivated()) {

        this.notificationService.addNotification('So... double-checking, just to be on the safe side?', 'info')
        
        this.router.navigate([''])

        return of(false)

      }

      return of(true)

    } else {

      this.notificationService.addNotification('You are not logged!', 'warning')

      this.router.navigate([''])

      return of(false);

    }
    
  }

}
