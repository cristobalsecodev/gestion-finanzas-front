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

  notificacion$ = this.notificacionSubject.asObservable()

  private idContador = 0

  addNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning') {
    
    const nuevaNotificacion: Notificacion = {
      mensaje,
      tipo,
      id: this.idContador++
    }

    const notificacionesActuales = this.notificacionSubject.value
    this.notificacionSubject.next([...notificacionesActuales, nuevaNotificacion])

  }

  removeNotificacion(id: number) {

    const notificacionesActuales = this.notificacionSubject.value.filter(
      (notificacion) => notificacion.id !== id
    )

    this.notificacionSubject.next(notificacionesActuales)

  }
}
