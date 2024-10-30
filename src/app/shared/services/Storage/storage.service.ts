import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setLocal(key: string, value: string): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem(key, value);

    }
  }

  getLocal(key: string): string | null {

    if (isPlatformBrowser(this.platformId)) {

      return localStorage.getItem(key);

    }

    return null;

  }

  removeLocal(key: string): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem(key);
      
    }
  }

  clear(): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.clear();

    }
  }

  setSession(key: string, value: string): void {

    if (isPlatformBrowser(this.platformId)) {

      sessionStorage.setItem(key, value);

    }

  }

  getSession(key: string) {

    if (isPlatformBrowser(this.platformId)) {

      return sessionStorage.getItem(key);

    }

    return null;

  }

  removeSession(key: string): void {

    if (isPlatformBrowser(this.platformId)) {

      sessionStorage.removeItem(key);
      
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
