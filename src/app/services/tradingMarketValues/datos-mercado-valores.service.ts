import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activo, FiltroActivo } from './DatosMercadoValores.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosMercadoValoresService {

  private apiUrl = 'http://localhost:8080/datos-mercado-valores/obtener-info-activo'

  constructor(private http: HttpClient) { }

  obtenerDatosActivo(filtro: FiltroActivo): Observable<Activo> {
    return this.http.post<Activo>(this.apiUrl, filtro)
  }
}
