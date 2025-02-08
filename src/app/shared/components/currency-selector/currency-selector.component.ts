import { Component, computed, effect, EventEmitter, inject, Output } from '@angular/core';
import { CurrencyExchangeService } from '../../services/CurrencyExchange/currency-exchange.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyExchange } from '../../services/CurrencyExchange/CurrencyExchange.interface';
import { FLAGS } from '../../constants/svg.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../../services/Storage/storage.service';
import { UserService } from '../../services/Users/user.service';

@Component({
  selector: 'app-currency-selector',
  standalone: true,
  imports: [
    // Angular core
    CommonModule,
    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss'
})
export class CurrencySelectorComponent {

  // Servicios
  currencyExchangeService = inject(CurrencyExchangeService)
  storageService = inject(StorageService)
  userService = inject(UserService)

  noCurrency: CurrencyExchange = {
    currencyCode: 'NONE',
    currencyName: 'None',
    exchangeRateToUsd: 1.0000
  }

  @Output() emitCurrency = new EventEmitter<CurrencyExchange>()

  selectedCurrency: CurrencyExchange = this.noCurrency

  currencies = computed(() => this.currencyExchangeService.currencies())

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {

    // Añadimos los SVGs
    FLAGS.forEach(flag => {

      this.matIconRegistry.addSvgIconLiteral(
        flag.currencyCode,
        this.domSanitizer.bypassSecurityTrustHtml(flag.svg)
      )

    })

    effect( () => {

      const convertCurrency: string | null = this.storageService.getLocal('convertCurrency')

      if(convertCurrency) {

        this.selectCurrency(
          this.currencies().find(currency => currency.currencyCode === this.storageService.getLocal('convertCurrency')) 
          || this.noCurrency
        )

      } else {

        this.selectCurrency(
          this.currencies().find(currency => currency.currencyCode === this.userService.userInfo()?.favoriteCurrency) 
          || this.noCurrency
        )

      }



    })

  }

  selectCurrency(currency: CurrencyExchange): void {

    this.selectedCurrency = currency

    this.storageService.setLocal('convertCurrency', currency.currencyCode)

    // Emite al padre la divisa seleccionada
    this.emitCurrency.emit(currency)

  }

}
