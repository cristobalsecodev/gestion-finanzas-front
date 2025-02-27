import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
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
import { activateAccountRoute, incomeExpensesRoute, loginRoute, signUpRoute } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { AuthService } from './auth/service/auth.service';
import { CurrencyExchangeService } from './shared/services/CurrencyExchange/currency-exchange.service';
import { ThemeModeService } from './shared/services/ThemeMode/theme-mode.service';
import { TokenService } from './shared/services/token/token.service';
import packageJson from '../../package.json'
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from './shared/components/dialogs/action-dialog/action-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Angular core
    RouterOutlet,
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

  // Versión app
  version = packageJson.version

  // Almacena la URL
  currentUrl = signal<string>('')

  // Comprueba si el sidenav está abierto
  sidenavOpened: boolean = false

  dropdownOpen = false

  // Rutas
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
  private dialog = inject(MatDialog)

  constructor(
    private elementRef: ElementRef,
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

    this.dialog.open(ActionDialogComponent, {
      data: {
        type: 'info',
        message: 'Are you sure you want to log out?',
        confirmButtonText: 'Log out',
        cancelButtonText: 'Go back'
      },
      maxWidth: '30vw'
    }).afterClosed().subscribe((isConfirmed: boolean) => {
      
      if (isConfirmed) {

        this.authService.logout()
        this.router.navigate([loginRoute])

      }

    });
    
  }


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    const dropdown = document.getElementById('currency-dropdown-menu');
    if (dropdown) {
      if (this.dropdownOpen) {
        dropdown.classList.add('show-dropdown-menu');
      } else {
        dropdown.classList.remove('show-dropdown-menu');
      }
    }
  }
  
  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInside = this.elementRef.nativeElement.contains(target);
    
    if (!isInside && this.dropdownOpen) {
      this.dropdownOpen = false;
      const dropdown = document.getElementById('currency-dropdown-menu');
      if (dropdown) {
        dropdown.classList.remove('show-dropdown-menu');
      }
    }
  }
  
  // Prevenir que el clic en el dropdown se propague al documento
  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
