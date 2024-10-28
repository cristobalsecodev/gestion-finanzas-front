import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../../shared/services/LocalStorage/local-storage.service';
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
    private localStorageService: LocalStorageService,
    private notificationsService: NotificacionesService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.apiUrl}/${loginRoute}`, { email, password })
      .pipe(
        tap(response => {

          this.localStorageService.setItem('token', response.token)

        })
      )
  }

  signUp(user: CreateUser): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(`${this.apiUrl}/${createAccountRoute}`, user)
      .pipe(
        tap(response => {

          this.localStorageService.setItem('token', response.token)

        })
      )

  }

  logout(): void {

    this.localStorageService.removeItem('token')

  }

  tokenExpirationChecker(): void {

    setInterval(() => {

      const expirationTime = parseInt(this.localStorageService.getItem('expirationTime') || '0', 10);
      const currentTime = new Date().getTime();
      const timeLeft = expirationTime - currentTime;

      if(timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {

        this.notificationsService.addNotification('Your sesion will expire in 5 minutes', 'warning')
        
      }

      if(timeLeft <= 0) {

        this.logout()
        this.router.navigate([loginRoute])

      }

    }, 60000)

  }

  isAuthenticated(): boolean {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? true : false

  }

  isAccountActivated(): Observable<boolean> {

    const decodedToken = this.decodeToken()
    
    return decodedToken ? decodedToken.isAccountActivated : false

  }

  decodeToken(): any {

    const token = localStorage.getItem('token')

    if(token) {

      return jwtDecode(token)

    }

    return null

  }

}
