import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificacionesService } from '../Notifications/notificaciones.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private authUrl = 'http://localhost:8080/email'

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
