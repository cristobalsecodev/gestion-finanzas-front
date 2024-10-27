import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from '../LocalStorage/local-storage.service';
import { CreateUser } from '../../interfaces/User.interface';
import { NotificacionesService } from '../Notifications/notificaciones.service';
import { InfoResponse } from '../../interfaces/InfoResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth'

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(email: string, password: string): Observable<string> {

    return this.http.post<string>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {

          this.localStorageService.setItem('token', response)

        })
      )
  }

  register(user: CreateUser): Observable<InfoResponse> {

    return this.http.post<InfoResponse>(`${this.apiUrl}/register`, user)

  }

  logout(): void {
    
    this.localStorageService.removeItem('token')

  }

  isAuthenticated(): boolean {

    return !!this.localStorageService.getItem('token')

  }

}
