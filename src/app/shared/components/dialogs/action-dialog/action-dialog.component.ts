import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActionType, DialogConfig } from 'src/app/shared/services/Dialogs/action-dialog.service';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular material
    MatIconModule
  ],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss'
})
export class ActionDialogComponent {

  @Input() config!: DialogConfig
  @Output() close = new EventEmitter<void>()

  isActive = false
  actionType = ActionType

  // Ejecuta la animación según el tipo
  animationClass = ''

  setActive(active: boolean): void {

    this.isActive = active

    if(active) {

      setTimeout(() => {

        // Aplica la animación
        switch(this.config.type) {

          case ActionType.DELETE:
            this.animationClass = 'shake'
            break
          case ActionType.WARNING:
            this.animationClass = 'pulse'
            break
          case ActionType.INFO:
            this.animationClass = 'bounce'
            break
          default:
            throw new Error('Action type not found')
        }

      }, 300)

      // Elimina la animación después de la aplicación
      setTimeout(() => {
        
        this.animationClass = ''

      }, 1100)

    }

  }

  onConfirm(): void {

    if(this.config.onConfirm) {

      this.config.onConfirm()

    } 
    this.close.emit()

  }

  onCancel(): void {

    if(this.config.onCancel) {

      this.config.onCancel()

    }
    this.close.emit()

  }

}
