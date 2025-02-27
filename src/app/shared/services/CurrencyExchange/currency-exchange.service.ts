import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CurrencyExchange } from './CurrencyExchange.interface';
import { CurrencyCodeENUM, CurrencyNameENUM } from '../../enums/Currency.enum';
import { StorageService } from '../Storage/storage.service';
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
  private storageService = inject(StorageService)
  private tokenService = inject(TokenService)
  private userService = inject(UserService)

  constructor(
    private http: HttpClient
  ) { }

  manageCurrencyService(): void {

    this.getCurrencies().subscribe({
      next: (currencies: CurrencyExchange[]) => {

        this.selectedCurrency.set(currencies.find(currency => currency.currencyCode === this.tokenService.favoriteCurrency()) || this.defaultCurrency)

        // Actualizamos las divisas
        this.currencies.set(currencies)

      }
    })

  }

  private getCurrencies(): Observable<CurrencyExchange[]> {

    if(this.currencies().length === 0) {

      return this.http.get<CurrencyExchange[]>(`${this.currencyExchangeUrl}/get-currencies`)

    } else {

      return of(this.currencies())

    }

  }

  selectFavoriteCurrency(currency: CurrencyExchange): void {

    this.userService.saveFavoriteCurrency(currency.currencyCode).subscribe()

    this.selectedCurrency.set(currency)

  }

}
