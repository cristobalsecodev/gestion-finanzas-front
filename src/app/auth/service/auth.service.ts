import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../../shared/services/Storage/storage.service';
import { CreateUser } from '../../shared/interfaces/User.interface';
import { activateAccountRoute, signUpRoute, loginRoute, resumeRoute } from '../../shared/constants/variables.constants';
import { TokenResponse } from '../interfaces/TokenResponse.interface';
import { jwtDecode } from "jwt-decode";
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'http://localhost:8080/auth'

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private notificationsService: NotificacionesService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.authUrl}/${loginRoute}`, { email, password })
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)

          if(this.isAccountActivated()) {

            this.router.navigate([resumeRoute])

          } else {

            this.router.navigate([activateAccountRoute])

          }

        })
      )
  }

  signUp(user: CreateUser): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.authUrl}/${signUpRoute}`, user)
      .pipe(
        tap(response => {

          this.storageService.setSession('token', response.token)

          this.router.navigate([activateAccountRoute])

        })
      )

  }

  refreshToken(token: string): Observable<TokenResponse> {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.http.get<TokenResponse>(`${this.authUrl}/refresh-token`, { headers })

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

  // isAuthenticated(): boolean {

  //   const decodedToken = this.decodeToken()
    
  //   return decodedToken ? true : false

  // }

  isAccountActivated(): Observable<boolean> {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? decodedToken.isAccountActivated : false

  }

  isAuthenticated(): boolean {

    // Calculamos la diferencia
    const timeDifference = this.calculateTokenTimeExp()
    
    return timeDifference > 0
    
  }

  isTokenExpiringSoon(threshold: number = 5): boolean {

    // Calculamos la diferencia con el límite de tiempo (threshold)
    const timeDifference = this.calculateTokenTimeExp()
    const thresholdInMilliseconds = threshold * 60 * 1000
    
    return timeDifference < thresholdInMilliseconds

  }

  private calculateTokenTimeExp(): number {

    // Decodificamos el token y cogemos su expiración
    const decodedToken: { exp: number } = this.decodeToken()

    if(decodedToken) {

      // Sacamos la fecha de ahora y la fecha de expiración
      const expirationDate = new Date(decodedToken.exp * 1000)
      const now = new Date()
  
      // Calculamos la diferencia
      return expirationDate.getTime() - now.getTime()

    }

    return -1

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

      this.router.navigate([loginRoute])

    }

    return null

  }

}
