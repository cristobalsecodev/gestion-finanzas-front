import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SafeHtml } from '@angular/platform-browser';
import { LOGO_SVG } from './shared/constants/svg.constants';
import { SecurizeSVGsService } from './services/securizeSVGs/securize-svgs.service';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { ThemeModes } from './shared/enums/ThemeModes.enum';
import { FormsModule } from '@angular/forms';

import {
  lucideMoon,
  lucideSun,
  lucideLaptop2,
  lucideAlertTriangle,
  lucideBarChart4
} from '@ng-icons/lucide';

import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuLabelComponent,
} from '@spartan-ng/ui-menu-helm';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    FormsModule,
    // Spartan UI
    HlmIconComponent,

    HlmButtonDirective,
    
    BrnMenuTriggerDirective,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuComponent,
    HlmMenuLabelComponent,
    HlmMenuGroupComponent,
  ],
  providers: [
    // Iconos Lucide
    provideIcons({
      lucideMoon,
      lucideSun,
      lucideLaptop2,
      lucideAlertTriangle,
      lucideBarChart4
    })
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  SVGs: { [key: string]: SafeHtml } = {}

  themeOptions = [ThemeModes.LIGHT, ThemeModes.DARK, ThemeModes.SYSTEM]

  themeSelected: string = 'System'

  isSystemThemeDark: boolean = false;

  themeModes = ThemeModes;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private securizeSVGsService: SecurizeSVGsService,
    private renderer: Renderer2
  ) {
    
    // Securizar cada SVG
    this.SVGs = this.securizeSVGsService.securizeSVGs({ Logo: LOGO_SVG })

    // Comprueba si accedemos desde un navegador
    if(isPlatformBrowser(this.platformId)) {
      this.isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.systemTheme()
    }
  }

  lightTheme(): void {
    this.renderer.removeClass(document.body, 'dark')
    this.renderer.setStyle(document.body, 'backgroundColor', '#f4f5f7') // Tailwind -> bg-themeMode-100
    
  }

  darkTheme(): void {
    this.renderer.addClass(document.body, 'dark')
    this.renderer.setStyle(document.body, 'backgroundColor', '#09090b') // Tailwind -> bg-themeMode-950
  }

  systemTheme(): void {
    if(this.isSystemThemeDark) {
      this.darkTheme()
    } else {
      this.lightTheme()
    }
    
  }

  changeTheme(theme: string): void {
    switch(theme) {
      case this.themeModes.LIGHT:
        this.lightTheme()
        this.themeSelected = this.themeModes.LIGHT
        break
      case this.themeModes.DARK:
        this.darkTheme()
        this.themeSelected = this.themeModes.DARK
        break
      default:
        this.systemTheme()
        this.themeSelected = this.themeModes.SYSTEM
        break
    }
  }

  iconThemes(theme: string): string {
    switch(theme) {
      case this.themeModes.LIGHT:
        return 'lucideSun'
      case this.themeModes.DARK:
        return 'lucideMoon'
      case this.themeModes.SYSTEM:
        return 'lucideLaptop2'
      default:
        return 'lucideAlertTriangle'
    }
  }

}
