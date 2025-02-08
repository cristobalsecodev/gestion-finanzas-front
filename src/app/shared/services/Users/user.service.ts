import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenResponse } from 'src/app/auth/interfaces/TokenResponse.interface';
import { UserInfo } from './interfaces/UserInfo.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8080/user'

  // Info usuario
  userInfo = signal<UserInfo | undefined>(undefined)

  constructor(
    private http: HttpClient
  ) { }

  activateAccount(activationCode: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(this.userUrl + '/activate-account', activationCode)

  }

  saveFavoriteCurrency(favoriteCurrency: string): Observable<void> {

    return this.http.post<void>(this.userUrl + '/save-favorite-currency', favoriteCurrency)

  }

  manageUserInfo(): void {

    this.getUserInfo().subscribe({
      next: (userInfo: UserInfo) => {

        // Asigna la info del usuario
        this.userInfo.set(userInfo)

      }
    })

  }

  private getUserInfo(): Observable<UserInfo> {

    if(!this.userInfo()) {

      return this.http.get<UserInfo>(`${this.userUrl}/user-info`)

    } else {

      return of(this.userInfo()!)

    }

  }

}
