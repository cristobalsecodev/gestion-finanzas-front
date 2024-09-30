import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
  lucideAlertTriangle
} from '@ng-icons/lucide';

import {
  HlmMenuBarComponent,
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
    BrnMenuTriggerDirective,
    HlmIconComponent,
    HlmMenuComponent,
    HlmMenuBarComponent,
    HlmMenuLabelComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmButtonDirective,
  ],
  providers: [
    // Iconos Lucide
    provideIcons({
      lucideMoon,
      lucideSun,
      lucideLaptop2,
      lucideAlertTriangle
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
    private securizeSVGsService: SecurizeSVGsService
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
    document.querySelector('body')?.classList.remove('dark')
  }

  darkTheme(): void {
    document.querySelector('body')?.classList.add('dark')
  }

  systemTheme(): void {
    if(this.isSystemThemeDark) {
      this.darkTheme();
    } else {
      this.lightTheme();
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
