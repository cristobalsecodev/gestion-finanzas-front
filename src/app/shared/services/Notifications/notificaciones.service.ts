import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  id: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private notificacionSubject = new BehaviorSubject<Notification[]>([])

  notification$ = this.notificacionSubject.asObservable()

  private counterId = 0

  addNotification(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    
    // Creamos el objeto de notificación
    const nuevaNotificacion: Notification = {
      mensaje,
      tipo,
      id: this.counterId++
    }

    // Añadimos la notificación
    const currentNotifications = this.notificacionSubject.value
    this.notificacionSubject.next([...currentNotifications, nuevaNotificacion])

    // Elimina la notificación tras X segundos
    setTimeout(() => {

      this.removeNotification(nuevaNotificacion.id)

    }, 3500)

  }

  removeNotification(id: number) {

    const currentNotifications = this.notificacionSubject.value.filter(
      (notification) => notification.id !== id
    )

    this.notificacionSubject.next(currentNotifications)

  }
}
