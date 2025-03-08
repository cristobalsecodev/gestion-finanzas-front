import { inject, Injectable } from '@angular/core';
import { StorageService } from '../Storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {

  private storageService = inject(StorageService)

  passwordStrength(documentId: string, password: string): void {

    const passwordStrengthElement = this.storageService.documentElementById(documentId)

    if(passwordStrengthElement) {

      let strength: number = 0
  
      // Más de 8 caracteres
      if (password.length >= 8) strength += 20
      // Al menos una minúscula
      if (password.match(/[a-z]+/)) strength += 20
      // Al menos una mayúscula
      if (password.match(/[A-Z]+/)) strength += 20
      // Al menos un número
      if (password.match(/[0-9]+/)) strength += 20
      // Al menos un caracter raro
      if (password.match(/[^a-zA-Z0-9]/)) strength += 20
  
      passwordStrengthElement.style.width = strength + '%'

      if (strength < 40) {
        passwordStrengthElement.style.backgroundColor = '#ef4444';
      } else if (strength < 60) {
        passwordStrengthElement.style.backgroundColor = '#f59e0b';
      } else if(strength < 80) {
        passwordStrengthElement.style.backgroundColor = '#10b981';
      } else {
        passwordStrengthElement.style.backgroundColor = '#00a550';
      }

    }
  }
  
}
