import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notificacion {
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  id: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private notificacionSubject = new BehaviorSubject<Notificacion[]>([])

  notification$ = this.notificacionSubject.asObservable()

  private counterId = 0

  addNotification(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    
    const nuevaNotificacion: Notificacion = {
      mensaje,
      tipo,
      id: this.counterId++
    }

    const currentNotifications = this.notificacionSubject.value
    this.notificacionSubject.next([...currentNotifications, nuevaNotificacion])

  }

  removeNotification(id: number) {

    const currentNotifications = this.notificacionSubject.value.filter(
      (notification) => notification.id !== id
    )

    this.notificacionSubject.next(currentNotifications)

  }
}
