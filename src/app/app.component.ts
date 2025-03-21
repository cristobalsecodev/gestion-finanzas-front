import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FLAGS } from './shared/constants/svg.constants';
import { activateAccountRoute, categoriesRoute, incomeExpensesFormRoute, incomeExpensesRoute, loginRoute, signUpRoute } from './shared/constants/variables.constants';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { AuthService } from './auth/service/auth.service';
import { CurrencyExchangeService } from './shared/services/CurrencyExchange/currency-exchange.service';
import { ThemeModeService } from './shared/services/ThemeMode/theme-mode.service';
import { TokenService } from './shared/services/token/token.service';
import packageJson from '../../package.json'
import { CurrencyExchange } from './shared/services/CurrencyExchange/CurrencyExchange.interface';
import { ActionDialogService } from './shared/services/Dialogs/action-dialog.service';
import { allTransactions, incomeOrExpenseToEdit } from './mis-ingresos-gastos/utils/SharedList';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Angular core
    RouterOutlet,
    CommonModule,
    // Angular Material
    MatIconModule,
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

  // Controla el menú desplegable de divisas
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
  private dialog = inject(ActionDialogService)

  constructor(
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

          // Si la url es diferente al formulario, borramos la posible edición de una transacción
          if(!this.currentUrl().includes(incomeExpensesFormRoute)) {

            incomeOrExpenseToEdit.set(undefined)

          }

          if(!this.currentUrl().includes(incomeExpensesRoute)) {

            allTransactions.set([])

          }

          // Desplaza el scroll al inicio
          this.viewportScroller.scrollToPosition([0, 0])

    })

  }

  logout(): void {

    this.dialog.openWarningModal(
      'Warning',
      'Are you sure you want to log out?',
      () => {

        this.authService.logout()

      }
    )

  }

  showTitle(): string {

    const actualRoute = this.router.url

    if(actualRoute.includes(incomeExpensesRoute)) {

      return 'Financial dashboard'

    } else if(actualRoute.includes(categoriesRoute)) {

      return 'Managing categories'

    } else if(actualRoute.includes(incomeExpensesFormRoute)) {

      return 'Transaction Form'

    } else {

      return ''

    }

  }

  currencyChange(currency: CurrencyExchange): void {

    this.currencyExchangeService.changeFavoriteCurrency(currency)

    // Cierra el dropdown
    this.dropdownOpen = false
    
    // Actualiza la clase del dropdown
    const dropdown = document.getElementById('currency-dropdown-menu')

    if (dropdown) {
      dropdown.classList.remove('show-dropdown-menu')
    } 

  }


  toggleDropdown(event: MouseEvent) {

    this.dropdownOpen = !this.dropdownOpen

    const dropdown = document.getElementById('currency-dropdown-menu')

    if (dropdown) {
      if (this.dropdownOpen) {
        dropdown.classList.add('show-dropdown-menu')
      } else {
        dropdown.classList.remove('show-dropdown-menu')
      }
    }

  }
  
  // Cierra el dropdown si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    // Si el dropdown no está abierto, no hace nada
    if (!this.dropdownOpen) return
    
    const target = event.target as HTMLElement
  
    // Referencia el dropdown
    const dropdown = document.getElementById('currency-dropdown-menu')
    
    // Verifica el botón que abre el dropdown
    const dropdownButton = document.getElementById('currency-button-dropdown')
    
    // Comprueba si el clic fue dentro del dropdown o en el botón
    const clickedInDropdown = dropdown && dropdown.contains(target)
    const clickedOnButton = dropdownButton && dropdownButton.contains(target)
    
    // Solo cierra si el clic fue fuera de ambos elementos
    if (!clickedInDropdown && !clickedOnButton && this.dropdownOpen) {
      this.dropdownOpen = false
      
      if (dropdown) {
        dropdown.classList.remove('show-dropdown-menu')
      }

      event.stopPropagation()
    }
  }

}
