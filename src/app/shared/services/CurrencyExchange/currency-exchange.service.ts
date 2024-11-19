import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CurrencyExchange } from './CurrencyExchange.interface';
import { CurrencyCodeENUM, CurrencyNameENUM } from '../../enums/Currency.enum';
import { StorageService } from '../Storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchangeService {

  private currencyExchangeUrl = 'http://localhost:8080/currency-exchange-ratio'

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

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  manageCurrencyService(): void {

    this.getCurrencies().subscribe({
      next: (currencies: CurrencyExchange[]) => {

        // Comprueba si el usuario tiene una divisa seleccionada y la actualiza en caso negativo
        this.updateUserCurrency()

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

  private updateUserCurrency(): void {

    const currency: CurrencyExchange = this.storageService.getLocal('currency')
    ? JSON.parse(this.storageService.getLocal('currency')!)
    : null

    if(!currency) {

      this.storageService.setLocal('currency', JSON.stringify(this.defaultCurrency))

    } else {

      this.selectedCurrency.set(currency)

    }

  }

  selectFavoriteCurrency(currencyCode: string, currencyName: string): void {

    const currency: CurrencyExchange = {
      currencyCode: currencyCode,
      currencyName: currencyName,
      exchangeRateToUsd: this.currencies().find(x => x.currencyCode === currencyCode)?.exchangeRateToUsd!
    }

    this.selectedCurrency.set(currency)

    this.storageService.setLocal('currency', JSON.stringify(currency))

  }

}
