import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FLAGS } from './shared/constants/svg.constants';
import { activateAccountRoute, incomeExpensesRoute, investmentsRoute, loginRoute, signUpRoute } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { AuthService } from './auth/service/auth.service';
import { CurrencyExchangeService } from './shared/services/CurrencyExchange/currency-exchange.service';
import { ThemeModeService } from './shared/services/ThemeMode/theme-mode.service';
import { TokenService } from './shared/services/token/token.service';

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
    MatIconModule,
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

  // Almacena la URL
  currentUrl = signal<string>('')

  // Comprueba si el sidenav está abierto
  sidenavOpened: boolean = false

  // Rutas
  readonly investmentsRoute = investmentsRoute
  readonly incomeExpensesRoute = incomeExpensesRoute
  readonly activateAccountRoute = activateAccountRoute
  readonly signUpRoute = signUpRoute
  readonly loginRoute = loginRoute

  // Servicios
  private router = inject(Router)
  private authService = inject(AuthService)
  public tokenService = inject(TokenService)
  public currencyExchangeService = inject(CurrencyExchangeService)
  public themeModeService = inject(ThemeModeService)

  constructor(
    iconRegistry: MatIconRegistry,
    private viewportScroller: ViewportScroller,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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

    if(this.tokenService.isTokenValid()) {

      this.currencyExchangeService.manageCurrencyService()

    }

  }

  logout(): void {

    this.authService.logout()

    this.router.navigate([loginRoute])
    
  }

}
