import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyConversion } from './ConversionDivisa.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversionDivisaService {

  private apiUrl = 'http://localhost:8080/rest/currency-conversion'

  constructor(private http: HttpClient) { }

  getCurrencyConversion(currency: string): Observable<CurrencyConversion> {
    return this.http.post<CurrencyConversion>(this.apiUrl, currency)
  }

}
