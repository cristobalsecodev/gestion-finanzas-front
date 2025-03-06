import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { ActionDialogComponent } from '../../components/dialogs/action-dialog/action-dialog.component';

export enum ActionType {
  DELETE = 'delete',
  WARNING = 'warning',
  INFO = 'info'
}

export interface DialogConfig {
  id?: string
  type: ActionType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

@Injectable({
  providedIn: 'root'
})
export class ActionDialogService {

  private dialogs: Map<string, ComponentRef<ActionDialogComponent>> = new Map()

  private applicationRef = inject(ApplicationRef)
  private environmentInjector = inject(EnvironmentInjector)

  open(config: DialogConfig): string {

    // Genera un ID único
    const dialogId = config.id || `dialog-${Date.now()}`
    config.id = dialogId

    // Si no encuentra el texto, le añade uno por defecto
    if(!config.confirmText) {

      switch(config.type) {
        case ActionType.DELETE:
          config.confirmText = 'Delete'
          config.cancelText = 'Cancel'
          break
        case ActionType.WARNING:
          config.confirmText = 'Continue'
          config.cancelText = 'Cancel'
          break
        case ActionType.INFO:
          config.confirmText = 'Understood'
          config.cancelText = 'Cancel'
          break
        default:
          throw new Error('Action type not found')
      }

    }

    // Crea el componente
    const componentRef = createComponent(ActionDialogComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: document.createElement('div')
    })

    // Establece las propiedades del componente
    componentRef.instance.config = config
    componentRef.instance.close.subscribe(() => {
      this.close(dialogId)
    })

    // Adjunta el árbol de componentes de angular
    this.applicationRef.attachView(componentRef.hostView)

    // Obtiene el elemento DOM y lo adjunta al body
    document.body.appendChild(componentRef.location.nativeElement)

    // Guarda la referencia
    this.dialogs.set(dialogId, componentRef)

    // Aplica la animación
    setTimeout(() =>{
      componentRef.instance.setActive(true)
    }, 10)

    return dialogId

  }

  openDeleteModal(title: string, message: string, onConfirm?: () => void, onCancel?: () => void): string {
    
    return this.open({
      type: ActionType.DELETE,
      title,
      message,
      onConfirm,
      onCancel
    })

  }

  openWarningModal(title: string, message: string, onConfirm?: () => void, onCancel?: () => void): string {
    
    return this.open({
      type: ActionType.WARNING,
      title,
      message,
      onConfirm,
      onCancel
    })

  }

  openInfoModal(title: string, message: string, onConfirm?: () => void): string {

    return this.open({
      type: ActionType.INFO,
      title,
      message,
      onConfirm
    })

  }

  // Cerrar modal específica
  close(id: string): void {

    const modalRef = this.dialogs.get(id)

    if (modalRef) {
      
      // Desactiva para animación de salida
      modalRef.instance.setActive(false)
      
      // Elimina el componente
      setTimeout(() => {

        this.applicationRef.detachView(modalRef.hostView)
        modalRef.destroy()
        this.dialogs.delete(id)

      }, 300)
    }
  }

  // Cerrar todas las modales
  closeAll(): void {

    this.dialogs.forEach((_, id) => {
      this.close(id)
    })

  }
}

