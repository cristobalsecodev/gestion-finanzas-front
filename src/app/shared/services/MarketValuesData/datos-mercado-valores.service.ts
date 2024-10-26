import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockForDay, StockForDayFilter } from './DatosMercadoValores.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosMercadoValoresService {

  private apiUrl = 'http://localhost:8080/rest/get-stock-for-day'

  constructor(private http: HttpClient) { }

  getStockForDay(filter: StockForDayFilter): Observable<StockForDay> {
    return this.http.post<StockForDay>(this.apiUrl, filter)
  }
  
}
