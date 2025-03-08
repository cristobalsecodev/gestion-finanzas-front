import { Injectable } from '@angular/core';
import { AuthService } from '../../auth.service';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { incomeExpensesRoute, loginRoute } from 'src/app/shared/constants/variables.constants';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPasswordResolverService {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificacionesService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    // Recuperamos la url completa con el token de url
    const urlToken: string = route.paramMap.get('urlToken') || ''
    
    return this.authService.checkOneTimeUrl(urlToken).pipe(
      map((response) => {

        this.notificationService.addNotification(response.message, 'success')
        return true

      }),
      catchError(() => {

        this.router.navigate([incomeExpensesRoute])
        return of(false)

      })
    );
  }

}
