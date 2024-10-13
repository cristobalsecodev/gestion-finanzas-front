import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, effect, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { TablaGeneralComponent } from './shared/components/tabla-general/tabla-general.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    FormsModule,
    TablaGeneralComponent,
    // Angular Material UI
    MatToolbar,
    MatButtonModule,
    MatIcon,
    MatSidenavModule,
    MatListModule
  ],
  providers: [],
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    iconRegistry: MatIconRegistry,
    private router: Router
  ) {

    // Añade la clase necesaria para el funcionamiento de los material symbols (mat-icons)
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined')

    // Comprueba si accedemos desde un navegador
    if(isPlatformBrowser(this.platformId)) {
      
      // Lógica para saber si el usuario ya tiene guardado un modo (oscuro o día)
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
      console.log(this.currentUrl())
    });
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
