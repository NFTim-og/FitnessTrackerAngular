import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppError } from '../shared/models/error.model';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { TokenService } from '../shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor(
    private errorHandler: ErrorHandlerService,
    private tokenService: TokenService
  ) {
    // Load saved preference from storage
    try {
      const savedTheme = this.tokenService.getThemePreference();
      if (savedTheme !== null) {
        this.darkModeSubject.next(savedTheme);
        this.updateTheme(savedTheme);
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'ThemeService.constructor');
      // Fall back to light mode if there's an error
      this.darkModeSubject.next(false);
      this.updateTheme(false);
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleTheme(): void {
    try {
      const newValue = !this.darkModeSubject.value;
      this.darkModeSubject.next(newValue);
      this.tokenService.setThemePreference(newValue);
      this.updateTheme(newValue);
    } catch (error) {
      throw this.errorHandler.handleError(
        new AppError('Failed to toggle theme', 'THEME_TOGGLE_ERROR'),
        'ThemeService.toggleTheme'
      );
    }
  }

  private updateTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}