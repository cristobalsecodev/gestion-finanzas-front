import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, effect, Inject, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';

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
    MatListModule
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  SVGs: { [key: string]: SafeHtml } = {}

  darkMode = signal(false)

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    iconRegistry: MatIconRegistry
  ) {

    // Añade la clase necesaria para el funcionamiento de los material symbols
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined')

    // Comprueba si accedemos desde un navegador
    if(isPlatformBrowser(this.platformId)) {
      const themeMode = localStorage.getItem('themeMode')
      if(themeMode) {
        themeMode === 'dark' ? this.darkMode.set(true) : this.darkMode.set(false)
      } else {
        this.darkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches)
      }
    }
  }

  setDarkMode = effect(() => {
    document.documentElement.classList.toggle('dark', this.darkMode())

    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--sys-surface')
    this.renderer.setStyle(document.body, 'backgroundColor', backgroundColor)

    this.darkMode()
      ? localStorage.setItem('themeMode', 'dark')
      : localStorage.setItem('themeMode', 'light')
  })
}
