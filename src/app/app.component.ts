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
import { incomeExpensesRoute, investmentsRoute, resumeRoute } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { AuthService } from './shared/services/Auth/auth.service';
import { LocalStorageService } from './shared/services/LocalStorage/local-storage.service';

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

  // Rutas
  readonly investmentsRoute = investmentsRoute
  readonly incomeExpensesRoute = incomeExpensesRoute
  readonly resumeRoute = resumeRoute

  constructor(
    iconRegistry: MatIconRegistry,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private localStorageService: LocalStorageService
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

    this.isUserAuthenticated() ?? this.router.navigate([this.resumeRoute])

  }
  
  ngOnInit(): void {

    this.userHasThemeModeSelected()

    // Escuchar cambios en la URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {

          // Actualiza la URL actual
          this.currentUrl.set(this.router.url)

          // Desplaza el scroll al inicio
          this.viewportScroller.scrollToPosition([0, 0])

    })

  }

  isUserAuthenticated(): boolean {

    return this.authService.isAuthenticated()

  }

  userHasThemeModeSelected(): void {

    // Lógica para comprobar si el usuario ya tiene guardado un modo (oscuro o día)
    const themeMode = this.localStorageService.getItem('themeMode')

    if(themeMode) {

      themeMode === 'dark' ? this.darkMode.set(true) : this.darkMode.set(false)

    } else {

      this.darkMode.set(this.localStorageService.matchMedia('(prefers-color-scheme: dark)'))

    }

  }

  setDarkMode = effect(() => {

    this.localStorageService.classListToggle('dark', this.darkMode())

    this.darkMode()
    ? this.localStorageService.setItem('themeMode', 'dark')
    : this.localStorageService.setItem('themeMode', 'light')

  })


  logout(): void {
    this.authService.logout()
    this.router.navigate([''])
  }

}
