import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { CurrencyCodeENUM, CurrencyNameENUM } from 'src/app/shared/enums/Currency.enum';
import { ConversionDivisaService } from 'src/app/shared/services/APIs/CurrencyConversion/conversion-divisa.service';
import { Currency, CurrencyConversion, ExchangeRate } from 'src/app/shared/services/APIs/CurrencyConversion/ConversionDivisa.interface';
import { NotificacionesService } from 'src/app/shared/services/Notifications/notificaciones.service';
import { StorageService } from 'src/app/shared/services/Storage/storage.service';
import { noValue } from 'src/app/shared/constants/variables.constants';

@Component({
  selector: 'app-mis-inversiones',
  standalone: true,
  imports: [
    // Angular material
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './mis-inversiones.component.html',
  styleUrl: './mis-inversiones.component.scss'
})
export class MisInversionesComponent implements OnInit {

  // Sin valor
  readonly noValue = noValue

  // Divisas ENUM
  readonly currencyCode = CurrencyCodeENUM
  readonly currencyName = CurrencyNameENUM

  // Divisas disponibles
  currencies: ExchangeRate[] = []
  
  // Divisa seleccionada
  selectedCurrency: Currency = {
    currencyCode: '',
    currencyName: ''
  }

  constructor(
    private conversionDivisaService: ConversionDivisaService,
    private notificacionesService: NotificacionesService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    
    this.conversionDivisaService.getCurrencyConversion(CurrencyCodeENUM.USD).subscribe({

      next: (result: CurrencyConversion) => {
          
        // Tratamos el retorno de divisas y su conversión
        this.manageCurrencyConversion(result)

      },

      error: () => this.notificacionesService.addNotification('The currency service has experienced a failure', 'error')

    })

  }

  manageCurrencyConversion(result: CurrencyConversion): void {

    if(result.exchangeRate.length > 0) {

      this.currencies = result.exchangeRate

    }

    // Lógica para comprobar si el usuario ya tiene una divisa seleccionada
    const currency = this.storageService.getLocal('currency')

    if(currency) {

      this.selectedCurrency = JSON.parse(currency)

    } else {

      this.selectedCurrency = this.currencies.find(
        currency => currency.currencyCode === this.currencyCode.USD) 
          ?? {
              currencyCode: this.currencyCode.USD, 
              currencyName: this.currencyName.USD
            }

    }

    // this.divisaService.currencyChange(this.selectedCurrency)
  }

  currencySelection(currencyCode: string, currencyName: string): void {

    let currency: Currency = {
      currencyCode: currencyCode,
      currencyName: currencyName
    }

    this.selectedCurrency = currency

    // this.divisaService.currencyChange(currency)

    this.storageService.setLocal('currency', JSON.stringify(currency))

  }
  

}
