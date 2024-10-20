import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversionDivisa } from './ConversionDivisa.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversionDivisaService {

  private apiUrl = 'http://localhost:8080/rest/conversion-divisa'

  constructor(private http: HttpClient) { }

  obtenerConversionDivisa(divisa: string): Observable<ConversionDivisa> {
    return this.http.post<ConversionDivisa>(this.apiUrl, divisa)
  }

}
