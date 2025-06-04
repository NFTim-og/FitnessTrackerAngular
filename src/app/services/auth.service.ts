/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { TokenService } from '../shared/services/token.service';

/**
 * Authentication Service
 * Injectable service that manages user authentication and session state
 */
@Injectable({
  providedIn: 'root' // Service is provided at the root level (singleton)
})
export class AuthService {
  // API endpoint for authentication
  private apiUrl = `${environment.apiUrl}/auth`;
  // BehaviorSubject to store and emit user data
  private userSubject = new BehaviorSubject<User | null>(null);

  // Observable stream that components can subscribe to
  user$ = this.userSubject.asObservable();

  /**
   * Constructor
   * @param http - Angular HTTP client for making API requests
   * @param errorHandler - Service for handling and formatting errors
   * @param tokenService - Service for managing token storage
   */
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private tokenService: TokenService
  ) {
    this.initializeAuth(); // Initialize authentication state on service creation
  }

  /**
   * Initialize authentication state
   * Checks for existing token and loads user profile if found
   * @private
   */
  private initializeAuth(): void {
    const token = this.tokenService.getToken();
    console.log('Auth Service - initializeAuth - Token exists:', !!token);
    if (token) {
      console.log('Auth Service - initializeAuth - Getting user profile');
      // Load user profile using the stored token
      this.getMe().subscribe({
        next: (user) => console.log('Auth Service - initializeAuth - User profile loaded:', user),
        error: (error) => console.error('Auth Service - initializeAuth - Error loading user profile:', error)
      });
    }
  }

  /**
   * Register a new user
   *
   * @param email - User's email address
   * @param password - User's password
   * @param passwordConfirm - Password confirmation (for validation)
   * @returns Observable with token and user data
   */
  register(email: string, password: string, passwordConfirm?: string): Observable<{ token: string, user: User }> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password, passwordConfirm })
      .pipe(
        map(response => {
          const { token, data } = response;
          const user = new User(data.user);
          this.setSession(token, user); // Store token and update user state
          return { token, user };
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'AuthService.register'));
        })
      );
  }

  /**
   * Log in an existing user
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Observable with token and user data
   */
  login(email: string, password: string): Observable<{ token: string, user: User }> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          const { token, data } = response;
          const user = new User(data.user);
          this.setSession(token, user); // Store token and update user state
          return { token, user };
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'AuthService.login'));
        })
      );
  }

  /**
   * Log out the current user
   * Removes the token and clears the user state
   */
  logout(): void {
    this.tokenService.removeToken(); // Remove token from storage
    this.userSubject.next(null); // Clear user state
  }

  /**
   * Get the current user's profile
   * Uses the stored token to fetch the user's profile from the API
   *
   * @returns Observable with user data
   */
  getMe(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/me`)
      .pipe(
        map(response => {
          const user = new User(response.data.user);
          this.userSubject.next(user); // Update user state
          return user;
        }),
        catchError(error => {
          this.logout(); // Log out if token is invalid or expired
          return throwError(() => this.errorHandler.handleError(error, 'AuthService.getMe'));
        })
      );
  }

  /**
   * Update the user's password
   *
   * @param currentPassword - User's current password
   * @param newPassword - User's new password
   * @param newPasswordConfirmation - New password confirmation (for validation)
   * @returns Observable with new token and updated user data
   */
  updatePassword(currentPassword: string, newPassword: string, newPasswordConfirmation?: string): Observable<{ token: string, user: User }> {
    return this.http.put<any>(`${this.apiUrl}/password`, { currentPassword, newPassword, newPasswordConfirmation })
      .pipe(
        map(response => {
          const { token, data } = response;
          const user = new User(data.user);
          this.setSession(token, user); // Update token and user state
          return { token, user };
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'AuthService.updatePassword'));
        })
      );
  }

  /**
   * Set the user session
   * Stores the token and updates the user state
   *
   * @param token - JWT authentication token
   * @param user - User object
   * @private
   */
  private setSession(token: string, user: User): void {
    console.log('Auth Service - Setting token:', token.substring(0, 10) + '...');
    this.tokenService.setToken(token); // Store token
    this.userSubject.next(user); // Update user state
    console.log('Auth Service - User subject updated:', user);
  }

  /**
   * Get the current user
   * @returns Current user object or null if not logged in
   */
  get currentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Get the current token
   * @returns JWT token or null if not logged in
   */
  get token(): string | null {
    return this.tokenService.getToken();
  }

  /**
   * Check if user is logged in
   * @returns True if user is logged in, false otherwise
   */
  get isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }

  /**
   * Check if current user is an admin
   * @returns True if user is an admin, false otherwise
   */
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
