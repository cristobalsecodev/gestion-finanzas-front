import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Currency, CurrencyConversion, ExchangeRate } from './CurrencyConversion.interface';
import { CurrencyCodeENUM, CurrencyNameENUM } from 'src/app/shared/enums/Currency.enum';
import { StorageService } from '../../Storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  private apiUrl = 'http://localhost:8080/rest/currency-conversion'

  // Divisas ENUM
  readonly currencyCode = CurrencyCodeENUM
  readonly currencyName = CurrencyNameENUM

  // Divisa por defecto
  defaultCurrency: Currency = {
    currencyCode: this.currencyCode.USD, 
    currencyName: this.currencyName.USD
  }

  // Divisa seleccionada
  selectedCurrency = signal<Currency>(this.defaultCurrency)

  // Divisas
  currencies = signal<ExchangeRate[]>([])

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {

  }

  manageCurrencyService(): void {

    this.getCurrenciesConversion(this.currencyCode.USD).subscribe()

  }

  private getCurrenciesConversion(currency: string): Observable<CurrencyConversion> {

    const currencies: CurrencyConversion = this.storageService.getLocal('currencies')
      ? JSON.parse(this.storageService.getLocal('currencies')!)
      : null

    const dateToUpdate = currencies?.nextUpdateDate 
      ? new Date(currencies.nextUpdateDate)
      : new Date(0);  // Fecha predeterminada en caso de null (1 de enero de 1970)

    // Normalizar para ignorar la hora exacta
    dateToUpdate.setHours(0, 0, 0 ,0)

    const today = new Date()

    // Normalizar para ignorar la hora exacta
    today.setHours(0, 0, 0, 0)

    if(!currencies || today.getTime() >= dateToUpdate.getTime()) {

      return this.http.post<CurrencyConversion>(this.apiUrl, currency)
        .pipe(
          tap((data) => {

            this.storageService.setLocal('currencies', JSON.stringify(data))

            this.currencies.set(data.exchangeRate)

            this.updateUserCurrency()

          })
        )

    } else {

      this.currencies.set(currencies.exchangeRate)

      this.updateUserCurrency()

      return of(currencies)

    }

  }

  updateUserCurrency(): void {

    // Comprueba si el usuario tiene una divisa seleccionada
    const currency: Currency = this.storageService.getLocal('currency')
    ? JSON.parse(this.storageService.getLocal('currency')!)
    : null

    if(!currency) {

      this.storageService.setLocal('currency', JSON.stringify(this.defaultCurrency))

    } else {

      this.selectedCurrency.set(currency)

    }

  }

  getUserCurrency(): Currency {

    const currency = this.storageService.getLocal('currency')

    return (currency) ? JSON.parse(currency) : this.defaultCurrency

  }

  selectFavoriteCurrency(currencyCode: string, currencyName: string): void {

    const currency: Currency = {
      currencyCode: currencyCode,
      currencyName: currencyName
    }

    this.selectedCurrency.set(currency)

    this.storageService.setLocal('currency', JSON.stringify(currency))

  }

}
