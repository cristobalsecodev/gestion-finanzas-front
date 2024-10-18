import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversionMoneda } from './ConversionMoneda.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversionMonedaService {

  private apiUrl = 'http://localhost:8080/rest/conversion-moneda'

  constructor(private http: HttpClient) { }

  obtenerConversionMoneda(moneda: string): Observable<ConversionMoneda> {
    return this.http.post<ConversionMoneda>(this.apiUrl, moneda)
  }

}
