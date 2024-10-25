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

import { ConversionDivisaService } from './services/ConversionDivisa/conversion-divisa.service';
import { ConversionDivisa, Divisa, RatioConversion } from './services/ConversionDivisa/ConversionDivisa.interface';
import { FLAGS } from './shared/constants/svg.constants';
import { SinValor } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { NotificacionesService } from './services/Notificaciones/notificaciones.service';
import { DivisaCodigoENUM, DivisaNombreENUM } from './shared/enums/Divisa.enum';
import { DivisaService } from './services/Divisa/divisa.service';

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
  currencies: RatioConversion[] = []

  // Divisas ENUM
  readonly divisaCodigo = DivisaCodigoENUM
  readonly divisaNombre = DivisaNombreENUM

  // Divisa seleccionada
  selectedCurrency: Divisa = {
    codigoDivisa: '',
    nombreDivisa: ''
  }

  // Sin valor
  readonly sinValor = SinValor

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
    this.conversionDivisaService.obtenerConversionDivisa(this.divisaCodigo.USD).subscribe({

      next: (result: ConversionDivisa) => {

        if(result.ratiosConversion.length > 0) {

          this.currencies = result.ratiosConversion

        }
  
        if(isPlatformBrowser(this.platformId)) {
          
          // Lógica para comprobar si el usuario ya tiene una divisa seleccionada
          const currency = localStorage.getItem('currency')

          if(currency) {

            this.selectedCurrency = JSON.parse(currency)

          } else {

            this.selectedCurrency = this.currencies.find(
              currency => currency.codigoDivisa === this.divisaCodigo.USD) 
                ?? {
                    codigoDivisa: this.divisaCodigo.USD, 
                    nombreDivisa: this.divisaNombre.USD
                  }

          }

          this.divisaService.currencyChange(this.selectedCurrency)
          
        }
      },

      error: () => this.notificacionesService.addNotification('Ha fallado el servicio de divisa', 'error')

    })

  }

  currencySelection(currencyCode: string, currencyName: string): void {

    let currency: Divisa = {
      codigoDivisa: currencyCode,
      nombreDivisa: currencyName
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
