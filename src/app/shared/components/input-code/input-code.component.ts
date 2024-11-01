import { Component, EventEmitter, Output } from '@angular/core';
import { StorageService } from '../../services/Storage/storage.service';

@Component({
  selector: 'app-input-code',
  standalone: true,
  imports: [],
  templateUrl: './input-code.component.html',
  styleUrl: './input-code.component.scss'
})
export class InputCodeComponent {

  @Output() activationCode = new EventEmitter<string>()

  confirmedCode: string = ''

  constructor(
    private storageService: StorageService
  ) {}

  moveToNext(event: any, nextInputId: string | null, prevInputId: string | null) {

    const inputElement = event.target as HTMLInputElement;
    

    // Si detectamos la tecla "retroceso" vamos hacia atrás
    if(event.key === 'Backspace') {

      if(inputElement.value.length === 0 && prevInputId) {
  
        const prevInput = this.storageService.documentElementById(prevInputId) as HTMLInputElement
  
        prevInput?.focus()
  
      }

      return

    }

    // Mover al siguiente campo si el actual tiene valor
    if(inputElement.value.length === 1 && nextInputId) {

      const nextInput = this.storageService.documentElementById(nextInputId) as HTMLInputElement

      nextInput?.focus()

    }

    // Emitir el código de activación si está completo
    this.emitActivationCode()

  }

  emitActivationCode() {

    let activationCode = ''

    for(let i = 1; i <= 6; i++) {

      const inputElement = this.storageService.documentElementById(`digit-${i}`) as HTMLInputElement

      if(inputElement) {

        activationCode += inputElement.value

      }

    }

    // Comprobamos que tiene 6 dígitos y que es diferente al código que se haya confirmado 
    // (para evitar que envíe repetidos)
    if(activationCode.length === 6 && activationCode !== this.confirmedCode) {

      this.confirmedCode = activationCode

      this.activationCode.emit(activationCode)

    }

  }

}
