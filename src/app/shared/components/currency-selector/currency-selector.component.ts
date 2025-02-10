import { Component, computed, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { CurrencyExchangeService } from '../../services/CurrencyExchange/currency-exchange.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyExchange } from '../../services/CurrencyExchange/CurrencyExchange.interface';
import { FLAGS } from '../../constants/svg.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenService } from '../../services/token/token.service';
import { CurrencyCodeENUM, CurrencyNameENUM } from '../../enums/Currency.enum';

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
  tokenService = inject(TokenService)

  @Input() tooltip: string = ''
  @Input() buttonText: string = ''
  @Output() emitCurrency = new EventEmitter<CurrencyExchange>()

  // Divisa por defecto
  defaultCurrency: CurrencyExchange = {
    currencyCode: CurrencyCodeENUM.USD, 
    currencyName: CurrencyNameENUM.USD,
    exchangeRateToUsd: 1.0000
  }  

  selectedCurrency: CurrencyExchange = this.defaultCurrency

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

      this.selectCurrency(
        this.currencies().find(currency => currency.currencyCode === this.tokenService.favoriteCurrency()) 
        || this.defaultCurrency
      )

    })

  }

  selectCurrency(currency: CurrencyExchange): void {

    this.selectedCurrency = currency

    // Emite al padre la divisa seleccionada
    this.emitCurrency.emit(currency)

  }

}
