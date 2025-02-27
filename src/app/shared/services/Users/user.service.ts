import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from 'src/app/auth/interfaces/TokenResponse.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = `${environment.apiUrl}/user`

  constructor(
    private http: HttpClient
  ) { }

  activateAccount(activationCode: string): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(this.userUrl + '/activate-account', activationCode)

  }

  saveFavoriteCurrency(favoriteCurrency: string): Observable<void> {

    return this.http.post<void>(this.userUrl + '/save-favorite-currency', favoriteCurrency)

  }

}
