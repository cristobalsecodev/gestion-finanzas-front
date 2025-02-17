import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockForDay, StockForDayFilter } from './MarketValuesData.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosMercadoValoresService {

  private apiUrl = `${environment.apiUrl}/rest/get-stock-for-day`

  constructor(private http: HttpClient) { }

  getStockForDay(filter: StockForDayFilter): Observable<StockForDay> {
    return this.http.post<StockForDay>(this.apiUrl, filter)
  }
  
}
