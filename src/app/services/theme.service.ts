import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Load saved preference from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const isDark = savedTheme === 'true';
      this.darkModeSubject.next(isDark);
      this.updateTheme(isDark);
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleTheme(): void {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    localStorage.setItem('darkMode', String(newValue));
    this.updateTheme(newValue);
  }

  private updateTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}