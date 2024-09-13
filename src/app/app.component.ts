import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeModes } from './shared/enums/ThemeModes.enum';
import { FlowbiteService } from './services/flowbite/flowbite.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { THEME_SVGS } from './shared/constants/svg.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  // Themes variables
  themesModes = ThemeModes
  themeSelected: string = this.themesModes.SYSTEM
  themeSVGS: { [key: string]: SafeHtml } = {}
  isSystemThemeDark: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private flowbiteService: FlowbiteService,
    private sanitizer: DomSanitizer
  ) {

    // Secure each SVG
    for (const [key, svg] of Object.entries(THEME_SVGS)) {
      this.themeSVGS[key] = this.sanitizer.bypassSecurityTrustHtml(svg);
    }

    // Check if we are entering from a browser
    if(isPlatformBrowser(this.platformId)) {
      this.isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.systemTheme()
    }

  }
  
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {});
  }

  changeTheme(typeTheme: string): void {

    switch(typeTheme) {
      case ThemeModes.LIGHT:
        this.lightTheme()
        this.themeSelected = ThemeModes.LIGHT
        break
      case ThemeModes.DARK:
        this.darkTheme()
        this.themeSelected = ThemeModes.DARK
        break
      default:
        this.systemTheme()
        this.themeSelected = ThemeModes.SYSTEM
        break
    }

  }

  darkTheme(): void {
    document.querySelector('body')?.classList.add('dark')
  }

  lightTheme(): void {
    document.querySelector('body')?.classList.remove('dark')
  }

  systemTheme(): void {
    if(this.isSystemThemeDark) {
      this.darkTheme();
    } else {
      this.lightTheme();
    }
    
  }
}
