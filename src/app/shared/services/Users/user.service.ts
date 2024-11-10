import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TokenResponse } from 'src/app/auth/interfaces/TokenResponse.interface';
import { StorageService } from '../Storage/storage.service';
import { Router } from '@angular/router';
import { resumeRoute } from '../../constants/variables.constants';
import { NotificacionesService } from '../Notifications/notificaciones.service';
import { AuthService } from 'src/app/auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8080/user/activate-account'

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificacionesService
  ) { }

  activateAccount(activationCode: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(this.userUrl, activationCode)
    .pipe(
      tap(response => {

        this.storageService.setSession('token', response.token)

        this.authService.startTokenCheck()

        this.notificationService.addNotification('Activated successfully', 'success')

        this.router.navigate([resumeRoute])

      })
    )

  }

}
