import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if(isPlatformBrowser(this.platformId)) {
      this.systemTheme()
    }
  }

  changeTheme(typeTheme: any): void {
    switch(typeTheme.target.value) {
      case 'light':
        this.lightTheme()
        break
      case 'dark':
        this.darkTheme()
        break
      default:
        this.systemTheme()
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
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkTheme();
    } else {
      this.lightTheme();
    }
  }

}
