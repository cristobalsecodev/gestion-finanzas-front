import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CurrencyExchange } from './CurrencyExchange.interface';
import { CurrencyCodeENUM, CurrencyNameENUM } from '../../enums/Currency.enum';
import { UserService } from '../Users/user.service';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchangeService {

  private currencyExchangeUrl = `${environment.apiUrl}/currency-exchange-ratio`

  // Divisas ENUM
  readonly currencyCode = CurrencyCodeENUM
  readonly currencyName = CurrencyNameENUM

  // Divisa por defecto
  defaultCurrency: CurrencyExchange = {
    currencyCode: this.currencyCode.USD, 
    currencyName: this.currencyName.USD,
    exchangeRateToUsd: 1.0000
  }

  // Divisa seleccionada
  selectedCurrency = signal<CurrencyExchange>(this.defaultCurrency)

  // Divisas
  currencies = signal<CurrencyExchange[]>([])

  // Servicios
  private tokenService = inject(TokenService)
  private userService = inject(UserService)

  constructor(
    private http: HttpClient
  ) { }

  initialize(): Promise<boolean> {

    return new Promise((resolve, reject) => {

      this.getCurrencies().subscribe({
        next: (currencies: CurrencyExchange[]) => {
  
          // Actualiza las divisas
          this.currencies.set(currencies)

          if(this.tokenService.isTokenValid()) {

            this.setFavoriteCurrency()
            
          }

          resolve(true)
        },
        error: () => {
          reject(false)
        }

      })

    })

  }

  private getCurrencies(): Observable<CurrencyExchange[]> {

    if(this.currencies().length === 0) {

      return this.http.get<CurrencyExchange[]>(`${this.currencyExchangeUrl}/get-currencies`)

    } else {

      return of(this.currencies())

    }

  }

  changeFavoriteCurrency(currency: CurrencyExchange): void {

    this.userService.saveFavoriteCurrency(currency.currencyCode).subscribe()

    this.selectedCurrency.set(currency)

  }

  setFavoriteCurrency(): void {

    this.selectedCurrency.set(this.currencies().find(currency => currency.currencyCode === this.tokenService.favoriteCurrency()) || this.defaultCurrency)

  }

}
