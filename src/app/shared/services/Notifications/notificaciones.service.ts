import { Injectable, signal } from '@angular/core';

export interface Notification {
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  notifications = signal<Notification[]>([])

  private counterId = 0

  addNotification(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    
    // Creamos el objeto de notificación
    const nuevaNotificacion: Notification = {
      mensaje,
      tipo,
      id: this.counterId++
    }

    // Añadimos la notificación
    this.notifications.update((current => [...current, nuevaNotificacion]))

    // Elimina la notificación tras X segundos
    setTimeout(() => {

      this.removeNotification(nuevaNotificacion.id)

    }, 5000)

  }

  removeNotification(id: number) {

    // Eliminamos la notificación a mano
    this.notifications.update((current => current.filter(n => n.id !== id)))

  }
}
