import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../../services/Storage/storage.service';

export const validTokenGuard: CanActivateFn = (route, state) => {

  const storageService = inject(StorageService)

  // Recuperamos la url completa con el token de url
  const urlParts: string[] = storageService.getFullUrl().split('/')

  const urlToken = urlParts.pop() || ''

  // TO DO: Meter aquí el servicio que comprueba si el token de la URL es correcto
  return true

};
