import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setItem(key: string, value: string): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem(key, value);

    }
  }

  getItem(key: string): string | null {

    if (isPlatformBrowser(this.platformId)) {

      return localStorage.getItem(key);

    }

    return null;

  }

  removeItem(key: string): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem(key);
      
    }
  }

  clear(): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.clear();

    }
  }

  classListToggle(className: string, toggle: boolean): void {

    if (isPlatformBrowser(this.platformId)) {

      document.documentElement.classList.toggle(className, toggle)

    }

  }

  matchMedia(match: string): boolean {

    if (isPlatformBrowser(this.platformId)) {

      return window.matchMedia(match).matches

    }

    return false

  }

}
