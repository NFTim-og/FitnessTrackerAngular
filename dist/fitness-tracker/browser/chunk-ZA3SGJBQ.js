import {
  ErrorHandlerService
} from "./chunk-AQ6Y7BDJ.js";
import {
  environment
} from "./chunk-NLRHYWXW.js";
import {
  BehaviorSubject,
  HttpClient,
  catchError,
  map,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-TOUTZUUN.js";

// src/app/shared/services/token.service.ts
var TokenService = class _TokenService {
  constructor() {
    this.TOKEN_KEY = "fitness_tracker_token";
    this.THEME_KEY = "darkMode";
  }
  /**
   * Store authentication token
   * @param token - JWT authentication token
   */
  setToken(token) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error("TokenService - Error storing token:", error);
      throw new Error("Failed to store authentication token");
    }
  }
  /**
   * Retrieve authentication token
   * @returns JWT token or null if not found
   */
  getToken() {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error("TokenService - Error retrieving token:", error);
      return null;
    }
  }
  /**
   * Remove authentication token
   */
  removeToken() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error("TokenService - Error removing token:", error);
    }
  }
  /**
   * Check if authentication token exists
   * @returns True if token exists, false otherwise
   */
  hasToken() {
    return !!this.getToken();
  }
  /**
   * Store theme preference
   * @param isDark - Whether dark mode is enabled
   */
  setThemePreference(isDark) {
    try {
      localStorage.setItem(this.THEME_KEY, String(isDark));
    } catch (error) {
      console.error("TokenService - Error storing theme preference:", error);
      throw new Error("Failed to store theme preference");
    }
  }
  /**
   * Retrieve theme preference
   * @returns Theme preference or null if not found
   */
  getThemePreference() {
    try {
      const saved = localStorage.getItem(this.THEME_KEY);
      return saved ? saved === "true" : null;
    } catch (error) {
      console.error("TokenService - Error retrieving theme preference:", error);
      return null;
    }
  }
  /**
   * Clear all stored data
   */
  clearAll() {
    try {
      this.removeToken();
      localStorage.removeItem(this.THEME_KEY);
    } catch (error) {
      console.error("TokenService - Error clearing storage:", error);
    }
  }
  static {
    this.\u0275fac = function TokenService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TokenService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TokenService, factory: _TokenService.\u0275fac, providedIn: "root" });
  }
};

// src/app/models/user.model.ts
var User = class {
  constructor(data = {}) {
    this.id = data.id || "";
    this.email = data.email || "";
    this.role = data.role || "user";
    this.created_at = data.created_at ? new Date(data.created_at) : /* @__PURE__ */ new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : /* @__PURE__ */ new Date();
  }
};

// src/app/services/auth.service.ts
var AuthService = class _AuthService {
  /**
   * Constructor
   * @param http - Angular HTTP client for making API requests
   * @param errorHandler - Service for handling and formatting errors
   * @param tokenService - Service for managing token storage
   */
  constructor(http, errorHandler, tokenService) {
    this.http = http;
    this.errorHandler = errorHandler;
    this.tokenService = tokenService;
    this.apiUrl = `${environment.apiUrl}/auth`;
    this.userSubject = new BehaviorSubject(null);
    this.user$ = this.userSubject.asObservable();
    this.initializeAuth();
  }
  /**
   * Initialize authentication state
   * Checks for existing token and loads user profile if found
   * @private
   */
  initializeAuth() {
    const token = this.tokenService.getToken();
    console.log("Auth Service - initializeAuth - Token exists:", !!token);
    if (token) {
      console.log("Auth Service - initializeAuth - Getting user profile");
      this.getMe().subscribe({
        next: (user) => console.log("Auth Service - initializeAuth - User profile loaded:", user),
        error: (error) => console.error("Auth Service - initializeAuth - Error loading user profile:", error)
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
  register(email, password, passwordConfirm) {
    return this.http.post(`${this.apiUrl}/register`, { email, password, passwordConfirm }).pipe(map((response) => {
      const { token, data } = response;
      const user = new User(data.user);
      this.setSession(token, user);
      return { token, user };
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "AuthService.register"));
    }));
  }
  /**
   * Log in an existing user
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Observable with token and user data
   */
  login(email, password) {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(map((response) => {
      const { token, data } = response;
      const user = new User(data.user);
      this.setSession(token, user);
      return { token, user };
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "AuthService.login", true));
    }));
  }
  /**
   * Log out the current user
   * Removes the token and clears the user state
   */
  logout() {
    this.tokenService.removeToken();
    this.userSubject.next(null);
  }
  /**
   * Get the current user's profile
   * Uses the stored token to fetch the user's profile from the API
   *
   * @returns Observable with user data
   */
  getMe() {
    return this.http.get(`${this.apiUrl}/me`).pipe(map((response) => {
      const user = new User(response.data.user);
      this.userSubject.next(user);
      return user;
    }), catchError((error) => {
      this.logout();
      return throwError(() => this.errorHandler.handleError(error, "AuthService.getMe", false));
    }));
  }
  /**
   * Update the user's password
   *
   * @param currentPassword - User's current password
   * @param newPassword - User's new password
   * @param newPasswordConfirmation - New password confirmation (for validation)
   * @returns Observable with new token and updated user data
   */
  updatePassword(currentPassword, newPassword, newPasswordConfirmation) {
    return this.http.put(`${this.apiUrl}/password`, { currentPassword, newPassword, newPasswordConfirmation }).pipe(map((response) => {
      const { token, data } = response;
      const user = new User(data.user);
      this.setSession(token, user);
      return { token, user };
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "AuthService.updatePassword", true));
    }));
  }
  /**
   * Set the user session
   * Stores the token and updates the user state
   *
   * @param token - JWT authentication token
   * @param user - User object
   * @private
   */
  setSession(token, user) {
    console.log("Auth Service - Setting token:", token.substring(0, 10) + "...");
    this.tokenService.setToken(token);
    this.userSubject.next(user);
    console.log("Auth Service - User subject updated:", user);
  }
  /**
   * Get the current user
   * @returns Current user object or null if not logged in
   */
  get currentUser() {
    return this.userSubject.value;
  }
  /**
   * Get the current token
   * @returns JWT token or null if not logged in
   */
  get token() {
    return this.tokenService.getToken();
  }
  /**
   * Check if user is logged in
   * @returns True if user is logged in, false otherwise
   */
  get isLoggedIn() {
    return this.tokenService.hasToken();
  }
  /**
   * Check if current user is an admin
   * @returns True if user is an admin, false otherwise
   */
  isAdmin() {
    return this.currentUser?.role === "admin";
  }
  static {
    this.\u0275fac = function AuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(ErrorHandlerService), \u0275\u0275inject(TokenService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _AuthService,
      factory: _AuthService.\u0275fac,
      providedIn: "root"
      // Service is provided at the root level (singleton)
    });
  }
};

export {
  TokenService,
  AuthService
};
//# sourceMappingURL=chunk-ZA3SGJBQ.js.map
