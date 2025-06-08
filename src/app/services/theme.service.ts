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
    console.log('ThemeService - Initializing');
    // Load saved preference from storage
    try {
      const savedTheme = this.tokenService.getThemePreference();
      console.log('ThemeService - Saved theme preference:', savedTheme);
      if (savedTheme !== null) {
        this.darkModeSubject.next(savedTheme);
        this.updateTheme(savedTheme);
      } else {
        // Ensure light mode is properly applied by default
        this.updateTheme(false);
      }
    } catch (error) {
      console.error('ThemeService - Error during initialization:', error);
      this.errorHandler.handleError(error, 'ThemeService.constructor');
      // Fall back to light mode if there's an error
      this.darkModeSubject.next(false);
      this.updateTheme(false);
    }
    console.log('ThemeService - Initialization complete, current mode:', this.isDarkMode() ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleTheme(): void {
    try {
      const newValue = !this.darkModeSubject.value;
      console.log('ThemeService - Toggling theme to:', newValue ? 'dark' : 'light');
      this.darkModeSubject.next(newValue);
      this.tokenService.setThemePreference(newValue);
      this.updateTheme(newValue);
    } catch (error) {
      console.error('ThemeService - Error toggling theme:', error);
      throw this.errorHandler.handleError(
        new AppError('Failed to toggle theme', 'THEME_TOGGLE_ERROR'),
        'ThemeService.toggleTheme'
      );
    }
  }

  private updateTheme(isDark: boolean): void {
    console.log('ThemeService - Updating theme, isDark:', isDark);

    // Remove both classes first to ensure clean state
    document.documentElement.classList.remove('dark-mode', 'light-mode');

    // Add the appropriate class
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }

    // Force a repaint to ensure CSS variables are applied
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight; // Trigger reflow
    document.documentElement.style.display = '';

    console.log('ThemeService - Theme updated, classes:', document.documentElement.classList.toString());
  }
}