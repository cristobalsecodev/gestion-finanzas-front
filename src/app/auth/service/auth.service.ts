import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../../shared/services/Storage/storage.service';
import { CreateUser } from '../../shared/interfaces/User.interface';
import { createAccountRoute, loginRoute } from '../../shared/constants/variables.constants';
import { TokenResponse } from '../interfaces/TokenResponse.interface';
import { jwtDecode } from "jwt-decode";
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth'

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private notificationsService: NotificacionesService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.apiUrl}/${loginRoute}`, { email, password })
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)

        })
      )
  }

  signUp(user: CreateUser): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.apiUrl}/${createAccountRoute}`, user)
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)

        })
      )

  }

  refreshToken(): Observable<TokenResponse> {

    return this.http.get<TokenResponse>(`${this.apiUrl}/refresh-token`)

  }

  logout(): void {

    this.storageService.removeSession('token')

  }

  tokenExpirationChecker(): void {

    // setInterval(() => {

    //   const expirationTime = parseInt(this.storageService.get('expirationTime') || '0', 10);
    //   const currentTime = new Date().getTime();
    //   const timeLeft = expirationTime - currentTime;

    //   if(timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {

    //     this.notificationsService.addNotification('Your sesion will expire in 5 minutes', 'warning')
        
    //   }

    //   if(timeLeft <= 0) {

    //     this.logout()
    //     this.router.navigate([loginRoute])

    //   }

    // }, 60000)

  }

  isAuthenticated(): boolean {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? true : false

  }

  isAccountActivated(): Observable<boolean> {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? decodedToken.isAccountActivated : false

  }

  isTokenExpiringSoon(threshold: number = 5): boolean {

    // Decodificamos el token y cogemos su expiración
    const decodedToken: { exp: number } = this.decodeToken()

    // Sacamos la fecha de ahora y la fecha de expiración
    const expirationDate = new Date(decodedToken.exp * 1000)
    const now = new Date()

    // Calculamos la diferencia con el límite de tiempo (threshold)
    const timeDifference = expirationDate.getTime() - now.getTime()
    const thresholdInMilliseconds = threshold * 60 * 1000
    
    return timeDifference < thresholdInMilliseconds

  }

  decodeToken(): any {

    const token = this.storageService.getSession('token')

    try {

      if(token) {

        return jwtDecode(token)

      }

    } catch (error) {

      console.error('Invalid token format', error)
      
      this.notificationsService.addNotification('Invalid token format', 'error')

    }

    return null

  }

}
