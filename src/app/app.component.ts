import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeModes } from './shared/enums/ThemeModes.enum';
import { FlowbiteService } from './services/flowbite/flowbite.service';
import { SafeHtml } from '@angular/platform-browser';
import { LOGO_SVG, THEME_SVGS } from './shared/constants/svg.constants';
import { SecurizeSVGsService } from './services/securizeSVGs/securize-svgs.service';

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
  SVGs: { [key: string]: SafeHtml } = {}
  isSystemThemeDark: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private flowbiteService: FlowbiteService,
    private securizeSVGsService: SecurizeSVGsService
  ) {
    
    // Securizar cada SVG
    this.SVGs = this.securizeSVGsService.securizeSVGs({ ...THEME_SVGS, Logo: LOGO_SVG })

    // Check if we are entering from a browser
    if(isPlatformBrowser(this.platformId)) {
      this.isSystemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

  }
  
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {});
  }
}
