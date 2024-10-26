import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, effect, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';

import { ConversionDivisaService } from './services/CurrencyConversion/conversion-divisa.service';
import { CurrencyConversion, Currency, ExchangeRate } from './services/CurrencyConversion/ConversionDivisa.interface';
import { FLAGS } from './shared/constants/svg.constants';
import { incomeExpensesRoute, investmentsRoute, resumeRoute, noValue } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { NotificacionesService } from './services/Notifications/notificaciones.service';
import { CurrencyCodeENUM, CurrencyNameENUM } from './shared/enums/Currency.enum';
import { DivisaService } from './services/Currency/divisa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Angular core
    RouterOutlet,
    RouterLink,
    CommonModule,
    // Angular Material
    MatToolbar,
    MatButtonModule,
    MatIcon,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    // Componentes
    NotificacionesComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  // Modo oscuro
  darkMode = signal(false)

  // Almacena la URL
  currentUrl = signal<string>('')

  // Comprueba si el sidenav está abierto
  sidenavOpened: boolean = false

  // Divisas disponibles
  currencies: ExchangeRate[] = []

  // Divisas ENUM
  readonly currencyCode = CurrencyCodeENUM
  readonly currencyName = CurrencyNameENUM

  // Rutas
  readonly investmentsRoute = investmentsRoute
  readonly incomeExpensesRoute = incomeExpensesRoute
  readonly resumeRoute = resumeRoute

  // Divisa seleccionada
  selectedCurrency: Currency = {
    currencyCode: '',
    currencyName: ''
  }

  // Sin valor
  readonly noValue = noValue

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    iconRegistry: MatIconRegistry,
    private router: Router,
    private conversionDivisaService: ConversionDivisaService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private notificacionesService: NotificacionesService,
    private divisaService: DivisaService
  ) {

    // Añadimos los SVGs
    FLAGS.forEach(flag => {

      this.matIconRegistry.addSvgIconLiteral(
        flag.currencyCode,
        this.domSanitizer.bypassSecurityTrustHtml(flag.svg)
      )
      
    })

    // Añade la clase necesaria para el funcionamiento de los material symbols (mat-icons)
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined')

    // Comprueba si accedemos desde un navegador
    if(isPlatformBrowser(this.platformId)) {
      
      // Lógica para comprobar si el usuario ya tiene guardado un modo (oscuro o día)
      const themeMode = localStorage.getItem('themeMode')

      if(themeMode) {

        themeMode === 'dark' ? this.darkMode.set(true) : this.darkMode.set(false)

      } else {

        this.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches)
        
      }

    }
  }
  
  ngOnInit(): void {

    // Escuchar cambios en la URL
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.currentUrl.set(this.router.url)
    })

    // Devolvemos los tipos de cambio de las principales divisas 
    this.conversionDivisaService.getCurrencyConversion(this.currencyCode.USD).subscribe({

      next: (result: CurrencyConversion) => {

        if(result.exchangeRate.length > 0) {

          this.currencies = result.exchangeRate

        }
  
        if(isPlatformBrowser(this.platformId)) {
          
          // Lógica para comprobar si el usuario ya tiene una divisa seleccionada
          const currency = localStorage.getItem('currency')

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

          this.divisaService.currencyChange(this.selectedCurrency)
          
        }
      },

      error: () => this.notificacionesService.addNotification('The currency service has experienced a failure', 'error')

    })

  }

  currencySelection(currencyCode: string, currencyName: string): void {

    let currency: Currency = {
      currencyCode: currencyCode,
      currencyName: currencyName
    }

    this.selectedCurrency = currency

    this.divisaService.currencyChange(currency)

    localStorage.setItem('currency', JSON.stringify(currency))

  }

  setDarkMode = effect(() => {

    if(isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', this.darkMode())

      this.darkMode()
      ? localStorage.setItem('themeMode', 'dark')
      : localStorage.setItem('themeMode', 'light')
    }

  })

}
