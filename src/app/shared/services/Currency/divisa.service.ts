import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrencyCodeENUM, CurrencyNameENUM } from 'src/app/shared/enums/Currency.enum';
import { Currency } from '../CurrencyConversion/ConversionDivisa.interface';

@Injectable({
  providedIn: 'root'
})
export class DivisaService {

  // Crear un BehaviorSubject para almacenar el cambio de divisa
  private currencySubject = new BehaviorSubject<Currency>({currencyCode: CurrencyCodeENUM.USD, currencyName: CurrencyNameENUM.USD})
  currency$ = this.currencySubject.asObservable()
  
  // Método para cambiar la divisa
  currencyChange(currency: Currency) {
    this.currencySubject.next(currency)
  }

}
