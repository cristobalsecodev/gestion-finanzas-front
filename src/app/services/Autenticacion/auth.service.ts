import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = ''

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  login(email: string, password: string) {

    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {

          if(isPlatformBrowser(this.platformId)) {

            localStorage.setItem('token', response.token)

          }

        })
      )

  }

  logout(): void {
    
    if(isPlatformBrowser(this.platformId)) {


      localStorage.removeItem('token')

    }
  }

  isAuthenticated(): boolean {

    if(isPlatformBrowser(this.platformId)) {

      return !!localStorage.getItem('token')

    }

    return false

  }

}
