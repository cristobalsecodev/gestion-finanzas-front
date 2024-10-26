import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { MatIcon } from '@angular/material/icon';

import { Notificacion, NotificacionesService } from 'src/app/services/Notifications/notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIcon
  ],
  animations: [
    trigger('fadeInRight', [
      transition(':enter', [
        animate(
          '0.2s ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }), // Inicio (fuera de pantalla)
            style({ opacity: 1, transform: 'translateX(0)', offset: 1 })     // Fin (en pantalla)
          ])
        )
      ])
    ])
  ],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent implements OnInit {

  notifications: Notificacion[] = [];

  constructor(private notificacionesService: NotificacionesService) {}

  ngOnInit(): void {

    this.notificacionesService.notification$.subscribe(
      (notifications) => (this.notifications = notifications)
    );

  }

  close(id: number) {

    this.notificacionesService.removeNotification(id)

  }

}
