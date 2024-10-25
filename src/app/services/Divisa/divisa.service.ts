import { Injectable } from '@angular/core';
import { Divisa } from '../ConversionDivisa/ConversionDivisa.interface';
import { BehaviorSubject } from 'rxjs';
import { DivisaCodigoENUM, DivisaNombreENUM } from 'src/app/shared/enums/Divisa.enum';

@Injectable({
  providedIn: 'root'
})
export class DivisaService {

  // Crear un BehaviorSubject para almacenar el cambio de divisa
  private divisaSubject = new BehaviorSubject<Divisa>({codigoDivisa: DivisaCodigoENUM.USD, nombreDivisa: DivisaNombreENUM.USD})
  currency$ = this.divisaSubject.asObservable()
  
  // Método para cambiar la divisa
  currencyChange(divisa: Divisa) {
    this.divisaSubject.next(divisa)
  }

}
