import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, effect, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { BANDERAS } from './shared/constants/svg.constants';
import { SinValor } from './shared/constants/variables.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    FormsModule,
    // Angular Material UI
    MatToolbar,
    MatButtonModule,
    MatIcon,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
[x: string]: any;

  // Modo oscuro
  darkMode = signal(false)

  // Almacena la URL
  currentUrl = signal<string>('')

  // Comprueba si el sidenav está abierto
  sidenavOpened: boolean = false

  // Divisas disponibles
  divisas: RatioConversion[] = []

  // Divisa seleccionada
  divisaSeleccionada: Divisa = {
    codigoDivisa: '',
    nombreDivisa: ''
  }

  // Sin valor
  sinValor = SinValor

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    iconRegistry: MatIconRegistry,
    private router: Router,
    private conversionDivisaService: ConversionDivisaService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {

    // Añadimos los SVGs
    BANDERAS.forEach(bandera => {
      this.matIconRegistry.addSvgIconLiteral(
        bandera.codigoDivisa,
        this.domSanitizer.bypassSecurityTrustHtml(bandera.svg)
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
    });

    // Devolvemos los tipos de cambio de las principales divisas 
    this.conversionDivisaService.obtenerConversionDivisa('USD').subscribe(((resultado: ConversionDivisa) => {

      if(resultado.ratiosConversion.length > 0) {
        this.divisas = resultado.ratiosConversion
      }


      if(isPlatformBrowser(this.platformId)) {
        
        // Lógica para comprobar si el usuario ya tiene una divisa seleccionada
        const divisa = localStorage.getItem('divisa')
        if(divisa) {
          this.divisaSeleccionada = JSON.parse(divisa)
        } else {
          this.divisaSeleccionada = this.divisas.find(divisa => divisa.codigoDivisa === 'EUR') ?? {codigoDivisa: '', nombreDivisa: ''}
        }
        
      }

    }))

  }

  seleccionDivisa(codigoDivisa: string, nombreDivisa: string): void {

    let divisa: Divisa = {
      codigoDivisa: codigoDivisa,
      nombreDivisa: nombreDivisa
    }

    this.divisaSeleccionada = divisa

    localStorage.setItem('divisa', JSON.stringify(divisa))

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
