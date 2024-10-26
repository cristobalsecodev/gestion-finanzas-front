import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = ''

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(email: string, password: string) {

    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {

          this.localStorageService.setItem('token', response.token)

        })
      )
  }

  logout(): void {
    
    this.localStorageService.removeItem('token')

  }

  isAuthenticated(): boolean {

    return !!this.localStorageService.getItem('token')

  }

}
