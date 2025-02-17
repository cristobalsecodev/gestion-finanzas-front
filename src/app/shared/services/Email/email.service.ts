import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificacionesService } from '../Notifications/notificaciones.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private authUrl = `${environment.apiUrl}/email`

  constructor(
    private http: HttpClient,
    private notificationService: NotificacionesService
  ) { }

  sendActivationEmail(): Observable<any> {

    return this.http.get<any>(`${this.authUrl}/send-activation-email`)
      .pipe(
        tap(response => {

          this.notificationService.addNotification(response.message, 'success')

        })
      )

  }

}
