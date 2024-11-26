import { effect, Injectable, signal } from '@angular/core';
import { StorageService } from '../Storage/storage.service';

enum ThemeModes {

  LIGHT = 'light',
  DARK = 'dark'

}

@Injectable({
  providedIn: 'root'
})
export class ThemeModeService {

  validThemes = new Set([ThemeModes.DARK, ThemeModes.LIGHT])

  themeMode = signal<ThemeModes.LIGHT | ThemeModes.DARK>(ThemeModes.DARK)

  themeModes = ThemeModes

  constructor(private storageService: StorageService) {

    const userTheme = this.storageService.getLocal('themeMode')

    if(userTheme && this.validThemes.has(userTheme as ThemeModes)) {

      this.themeMode.set(userTheme as ThemeModes)

    }
    
    effect(() => {

      this.applyTheme()

    });
    
  }

  setMode(newValue: ThemeModes): void {

    this.themeMode.set(newValue)

  }

  applyTheme(): void {

    if(this.themeMode() === ThemeModes.DARK) {

      this.storageService.classList('dark', 'add')

      this.storageService.setLocal('themeMode', 'dark')

    } else {

      this.storageService.classList('dark', 'remove')

      this.storageService.setLocal('themeMode', 'light')

    }

  }
}
