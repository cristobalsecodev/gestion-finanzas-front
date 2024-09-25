import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeModes } from './shared/enums/ThemeModes.enum';
import { SafeHtml } from '@angular/platform-browser';
import { LOGO_SVG, THEME_SVGS } from './shared/constants/svg.constants';
import { SecurizeSVGsService } from './services/securizeSVGs/securize-svgs.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    // Spartan UI
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  SVGs: { [key: string]: SafeHtml } = {}
  isSystemThemeDark: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private securizeSVGsService: SecurizeSVGsService
  ) {
    
    // Securizar cada SVG
    this.SVGs = this.securizeSVGsService.securizeSVGs({ ...THEME_SVGS, Logo: LOGO_SVG })

    // Comprueba si accedemos desde un navegador
    if(isPlatformBrowser(this.platformId)) {
      this.isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

  }
}
