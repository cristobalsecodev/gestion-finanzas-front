import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { StorageService } from '../Storage/storage.service';
import { NotificacionesService } from '../Notifications/notificaciones.service';
import { loginRoute } from '../../constants/variables.constants';
import { Router } from '@angular/router';
import { CurrencyCodeENUM } from '../../enums/Currency.enum';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Comprueba si el token es válido
  isTokenValid = signal<boolean>(false)

  intervalId: any

  // Servicios
  private storageService = inject(StorageService)
  private notificationsService = inject(NotificacionesService)
  private router = inject(Router)

  constructor() {

    this.isTokenValid.set(this.isAuthenticated())

    // En caso de que exista, comienza al intervalo
    if(this.isTokenValid()) {

      this.startTokenCheck()

    }

  }


  // Empieza el checkeo del token cada X minutos
  startTokenCheck(): void {

    // Verificación inicial del token
    this.checkTokenValidity()

    // Configuramos el intervalo
    if(!this.intervalId) {

      this.intervalId = setInterval(() => this.checkTokenValidity(), 60000)

    }

  }

  // Para el checkeo del token
  stopTokenCheck(): void {

    if(this.intervalId) {

      clearInterval(this.intervalId)

      this.intervalId = null

    }

  }

  // Actualiza si el token sigue siendo válido
  checkTokenValidity(): void {

    const timeRemaining = this.calculateTokenTimeExp()

    const isValid = timeRemaining > 0

    this.isTokenValid.set(isValid)

  }

  // Comprueba si la cuenta está activada
  isAccountActivated(): boolean {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? decodedToken.isAccountActivated : false

  }

  // Recupera la divisa favorita del usuario
  favoriteCurrency(): string {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? decodedToken.favoriteCurrency : CurrencyCodeENUM.USD

  }

  // Comprueba si el token es válido
  isAuthenticated(): boolean {

    // Calculamos la diferencia
    const timeDifference = this.calculateTokenTimeExp()
    
    return timeDifference > 0
    
  }

  // Comprueba si el token va a expirar pronto
  isTokenExpiringSoon(threshold: number = 5): boolean {

    // Calculamos la diferencia con el límite de tiempo (threshold)
    const timeDifference = this.calculateTokenTimeExp()
    const thresholdInMilliseconds = threshold * 60 * 1000
    
    return timeDifference < thresholdInMilliseconds

  }

  // Calcula el tiempo de expiración del token
  private calculateTokenTimeExp(): number {

    // Cogemos la expiración del token
    const expirationTime = this.extractExpirationTimeToken()

    if(expirationTime) {

      // Sacamos la fecha de ahora y la fecha de expiración
      const expirationDate = new Date(expirationTime * 1000)
      const now = new Date()
  
      // Calculamos la diferencia
      return expirationDate.getTime() - now.getTime()

    }

    return -1

  }

  private extractExpirationTimeToken(): number | null {

    const decodedToken: { exp: number } = this.decodeToken()

    if(decodedToken) {

      return decodedToken.exp

    }

    return null

  }

  // Decodifica el token
  decodeToken(): any {

    const token = this.storageService.getSession('token')

    try {

      if(token) {

        return jwtDecode(token)

      }

    } catch (error) {

      console.error('Invalid token format', error)
      
      this.notificationsService.addNotification('Invalid token format', 'error')

      this.router.navigate([loginRoute])

    }

    return null

  }


}
