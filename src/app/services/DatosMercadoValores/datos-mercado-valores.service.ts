import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivoDiaUnico, FiltroActivoDiaUnico } from './DatosMercadoValores.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosMercadoValoresService {

  private apiUrl = 'http://localhost:8080/rest/obtener-activo-unico-dia'

  constructor(private http: HttpClient) { }

  obtenerDatosActivo(filtro: FiltroActivoDiaUnico): Observable<ActivoDiaUnico> {
    return this.http.post<ActivoDiaUnico>(this.apiUrl, filtro)
  }
  
}
