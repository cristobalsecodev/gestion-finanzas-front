import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FLAGS } from './shared/constants/svg.constants';
import { activateAccountRoute, incomeExpensesRoute, investmentsRoute, loginRoute, resumeRoute, signUpRoute } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { AuthService } from './auth/service/auth.service';
import { StorageService } from './shared/services/Storage/storage.service';
import { CurrencyExchangeService } from './shared/services/CurrencyExchange/currency-exchange.service';

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
  darkMode = signal<boolean>(true)

  // Almacena la URL
  currentUrl = signal<string>('')

  // Comprueba si el sidenav está abierto
  sidenavOpened: boolean = false

  // Rutas
  readonly investmentsRoute = investmentsRoute
  readonly incomeExpensesRoute = incomeExpensesRoute
  readonly resumeRoute = resumeRoute
  readonly activateAccountRoute = activateAccountRoute
  readonly signUpRoute = signUpRoute
  readonly loginRoute = loginRoute

  constructor(
    iconRegistry: MatIconRegistry,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public authService: AuthService,
    public currencyExchangeService: CurrencyExchangeService,
    private storageService: StorageService
  ) {

    this.userHasThemeModeSelected()

    // Añadimos los SVGs
    FLAGS.forEach(flag => {

      this.matIconRegistry.addSvgIconLiteral(
        flag.currencyCode,
        this.domSanitizer.bypassSecurityTrustHtml(flag.svg)
      )

    })

    // Añade la clase necesaria para el funcionamiento de los material symbols (mat-icons)
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined')

  }
  
  ngOnInit(): void {

    // Escucha cambios en la URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {

          // Actualiza la URL actual
          this.currentUrl.set(this.router.url)

          // Desplaza el scroll al inicio
          this.viewportScroller.scrollToPosition([0, 0])

    })

    if(this.authService.isTokenValid()) {

      this.currencyExchangeService.manageCurrencyService()

    }

  }

  userHasThemeModeSelected(): void {

    // Lógica para comprobar si el usuario ya tiene guardado un modo (oscuro o día)
    const themeMode = this.storageService.getLocal('themeMode')

    if(themeMode) {

      themeMode === 'dark' ? this.darkMode.set(true) : this.darkMode.set(false)

    } else {

      this.darkMode.set(this.storageService.matchMedia('(prefers-color-scheme: dark)'))

    }

  }

  setDarkMode = effect(() => {

    this.storageService.classListToggle('dark', this.darkMode())

    this.darkMode()
    ? this.storageService.setLocal('themeMode', 'dark')
    : this.storageService.setLocal('themeMode', 'light')

  })

  logout(): void {

    this.authService.logout()

    this.router.navigate([loginRoute])
    
  }

}
