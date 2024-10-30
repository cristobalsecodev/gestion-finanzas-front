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

  private notifitacionSubject = new BehaviorSubject<Notification[]>([])

  notification$ = this.notifitacionSubject.asObservable()

  private counterId = 0

  addNotification(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    
    // Creamos el objeto de notificación
    const nuevaNotificacion: Notification = {
      mensaje,
      tipo,
      id: this.counterId++
    }

    // Añadimos la notificación
    const currentNotifications = this.notifitacionSubject.value
    this.notifitacionSubject.next([...currentNotifications, nuevaNotificacion])

    // Elimina la notificación tras X segundos
    setTimeout(() => {

      this.removeNotification(nuevaNotificacion.id)

    }, 3500)

  }

  removeNotification(id: number) {

    // Eliminamos la notificación a mano
    const currentNotifications = this.notifitacionSubject.value.filter(
      (notification) => notification.id !== id
    )

    this.notifitacionSubject.next(currentNotifications)

  }
}
