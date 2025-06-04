import { Injectable } from '@angular/core';

/**
 * Token Service
 * Abstracts token storage and retrieval operations
 * Provides a centralized way to manage authentication tokens
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'fitness_tracker_token';
  private readonly THEME_KEY = 'darkMode';

  /**
   * Store authentication token
   * @param token - JWT authentication token
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('TokenService - Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  /**
   * Retrieve authentication token
   * @returns JWT token or null if not found
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('TokenService - Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Remove authentication token
   */
  removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('TokenService - Error removing token:', error);
    }
  }

  /**
   * Check if authentication token exists
   * @returns True if token exists, false otherwise
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Store theme preference
   * @param isDark - Whether dark mode is enabled
   */
  setThemePreference(isDark: boolean): void {
    try {
      localStorage.setItem(this.THEME_KEY, String(isDark));
    } catch (error) {
      console.error('TokenService - Error storing theme preference:', error);
      throw new Error('Failed to store theme preference');
    }
  }

  /**
   * Retrieve theme preference
   * @returns Theme preference or null if not found
   */
  getThemePreference(): boolean | null {
    try {
      const saved = localStorage.getItem(this.THEME_KEY);
      return saved ? saved === 'true' : null;
    } catch (error) {
      console.error('TokenService - Error retrieving theme preference:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  clearAll(): void {
    try {
      this.removeToken();
      localStorage.removeItem(this.THEME_KEY);
    } catch (error) {
      console.error('TokenService - Error clearing storage:', error);
    }
  }
}
