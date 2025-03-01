import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../../shared/services/Storage/storage.service';
import { CreateUser } from '../../shared/services/Users/interfaces/CreateUser.interface';
import { activateAccountRoute, signUpRoute, loginRoute, incomeExpensesRoute, testLoginRoute } from '../../shared/constants/variables.constants';
import { TokenResponse } from '../interfaces/TokenResponse.interface';

import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { Router } from '@angular/router';
import { WantResetPassword } from '../interfaces/WantResetPassword.interface';
import { ResetPassword } from '../interfaces/ResetPassword.interface';
import { CurrencyExchangeService } from 'src/app/shared/services/CurrencyExchange/currency-exchange.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = `${environment.apiUrl}/auth`

  // Servicios
  private http = inject(HttpClient)
  private storageService = inject(StorageService)
  private notificationsService = inject(NotificacionesService)
  private router = inject(Router)
  private currencyExchangeService = inject(CurrencyExchangeService)
  private tokenService = inject(TokenService)

  // Login del usuario
  login(email: string, password: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.authUrl}/${loginRoute}`, { email, password })
      .pipe(
        tap(response => {

          this.managePostLogin(response)
          
        })
      )
  }

  // Login de TEST
  testLogin(): Observable<TokenResponse> {

    return this.http.get<TokenResponse>(`${this.authUrl}/${testLoginRoute}`)
      .pipe(
        tap(response => {

          this.managePostLogin(response)

        })
      )
  }

  private managePostLogin(response: any): void {

    this.storageService.setSession('token', response.token)

    // Llama al servicio de divisas
    this.currencyExchangeService.manageCurrencyService()

    

    // Empieza a comprobar el checkeo si no existe el intervalo
    if(!this.tokenService.intervalId) {

      this.tokenService.startTokenCheck()

    } else {

      this.tokenService.checkTokenValidity()

    }

    if(this.tokenService.isAccountActivated()) {

      this.router.navigate([incomeExpensesRoute])

    } else {

      this.router.navigate([activateAccountRoute])

    }

  }

  // Creación del usuario
  signUp(user: CreateUser): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.authUrl}/${signUpRoute}`, user)
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)

          // Llama al servicio de divisas
          this.currencyExchangeService.manageCurrencyService()

          this.notificationsService.addNotification('Account created', 'success')

          // Empieza a comprobar el checkeo si no existe el intervalo
          if(!this.tokenService.intervalId) {

            this.tokenService.startTokenCheck()
      
          } else {
      
            this.tokenService.checkTokenValidity()
      
          }

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

    this.storageService.removeSession('token')
    this.tokenService.checkTokenValidity()

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

}
