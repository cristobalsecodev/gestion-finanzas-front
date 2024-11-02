import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CurrencyConversion } from './ConversionDivisa.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversionDivisaService {

  private apiUrl = 'http://localhost:8080/rest/currency-conversion'

  private currencyConversion!: CurrencyConversion

  constructor(private http: HttpClient) { }

  getCurrencyConversion(currency: string): Observable<CurrencyConversion> {
    if(this.currencyConversion) {

      return of(this.currencyConversion)

    } else {

      return this.http.post<CurrencyConversion>(this.apiUrl, currency)
        .pipe(
          tap((data) => (this.currencyConversion = data))
        )

    }
  }

}
