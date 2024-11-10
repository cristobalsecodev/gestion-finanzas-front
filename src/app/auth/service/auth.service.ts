import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../../shared/services/Storage/storage.service';
import { CreateUser } from '../../shared/interfaces/User.interface';
import { activateAccountRoute, signUpRoute, loginRoute, resumeRoute } from '../../shared/constants/variables.constants';
import { TokenResponse } from '../interfaces/TokenResponse.interface';
import { jwtDecode } from "jwt-decode";
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { Router } from '@angular/router';
import { WantResetPassword } from '../interfaces/WantResetPassword.interface';
import { ResetPassword } from '../interfaces/ResetPassword.interface';
import { CurrencyConversionService } from 'src/app/shared/services/APIs/CurrencyConversion/currency-conversion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:8080/auth'

  // Comprueba si el token es válido
  isTokenValid = signal<boolean>(false)

  private intervalId: any

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private notificationsService: NotificacionesService,
    private router: Router,
    private currencyConversionService: CurrencyConversionService
  ) {

    this.isTokenValid.set(this.isAuthenticated())

    // En caso de que exista, comienza al intervalo
    if(this.isTokenValid()) {

      this.startTokenCheck()

    }

  }

  // Login del usuario
  login(email: string, password: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.authUrl}/${loginRoute}`, { email, password })
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)

          // Llamamos al servicio de divisas
          this.currencyConversionService.manageCurrencyService()

          if(this.isAccountActivated()) {

            // Empezamos a comprobar el checkeo si no existe el intervalo
            if(!this.intervalId) {

              this.startTokenCheck()

            }

            this.router.navigate([resumeRoute])

          } else {

            this.router.navigate([activateAccountRoute])

          }

        })
      )
  }

  // Creación del usuario
  signUp(user: CreateUser): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.authUrl}/${signUpRoute}`, user)
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)
          
          // Llamamos al servicio de divisas
          this.currencyConversionService.manageCurrencyService()

          this.notificationsService.addNotification('Account created', 'success')

          this.router.navigate([activateAccountRoute])

        })
      )

  }

  // Refresca el token
  refreshToken(token: string): Observable<TokenResponse> {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http.get<TokenResponse>(`${this.authUrl}/refresh-token`, { headers })

  }

  // Cierre de sesión
  logout(): void {

    this.stopTokenCheck()

    this.storageService.removeSession('token')

    this.checkTokenValidity()

  }

  // El usuario quiere resetear la contraseña
  wantResetPassword(wantResetPassword: WantResetPassword): Observable<any> {

    return this.http.post<any>(`${this.authUrl}/want-reset-password`, wantResetPassword)
      .pipe(
        tap(response => {

          this.notificationsService.addNotification(response.message, 'success')

        })
      )

  }

  // Restaurar contraseña
  resetPassword(resetPassword: ResetPassword): Observable<any> {

    return this.http.post<any>(`${this.authUrl}/reset-password`, resetPassword)
      .pipe(
        tap(response => {

          this.notificationsService.addNotification(response.message, 'success')

        })
      )

  }

  checkOneTimeUrl(urlToken: string): Observable<any> {

    return this.http.post<any>(`${this.authUrl}/check-one-time-url`, { token: urlToken })

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
  private checkTokenValidity(): void {

    const timeRemaining = this.calculateTokenTimeExp()

    const isValid = timeRemaining > 0

    this.isTokenValid.set(isValid)

  }

  // Comprueba si la cuenta está activada
  isAccountActivated(): Observable<boolean> {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? decodedToken.isAccountActivated : false

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
