import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AppError } from '../../shared/models/error.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styles: [`
    .navbar {
      background: var(--card-background);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      position: relative;
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 5rem;
    }

    /* Brand logo styling */
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
      transition: all 0.2s ease;
    }

    .brand-logo:hover {
      color: var(--primary-color);
      text-decoration: none;
      transform: translateY(-1px);
    }

    .brand-logo:visited {
      color: var(--primary-color);
      text-decoration: none;
    }

    .brand-logo .material-icons {
      color: var(--primary-color);
    }

    .brand-icon {
      font-size: 2rem;
    }

    /* Desktop navigation */
    .desktop-nav {
      display: none !important;
      align-items: center;
      gap: 0.75rem;
    }

    @media (min-width: 768px) {
      .desktop-nav {
        display: flex !important;
      }
    }

    /* Ensure desktop nav is completely hidden on mobile */
    @media (max-width: 767px) {
      .desktop-nav {
        display: none !important;
        visibility: hidden !important;
      }
    }

    .nav-link {
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 0.5rem;
      cursor: pointer;
      color: var(--text-color);
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background-color: rgba(59, 130, 246, 0.05);
      text-decoration: none;
    }

    .nav-link:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nav-button {
      border: none;
      background: transparent;
    }

    .nav-error {
      color: var(--danger-color);
      font-size: 0.875rem;
      padding: 0.5rem;
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: 0.375rem;
      border: 1px solid var(--danger-color);
    }

    /* Mobile menu button */
    .mobile-menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border: none;
      background: transparent;
      color: var(--text-color);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent; /* Remove tap highlight on iOS */
      touch-action: manipulation; /* Improve touch responsiveness */
    }

    .mobile-menu-button:hover,
    .mobile-menu-button:focus {
      background-color: var(--border-color);
      color: var(--primary-color);
      outline: none;
    }

    .mobile-menu-button:active {
      transform: scale(0.95);
      background-color: var(--primary-color);
      color: white;
    }

    @media (min-width: 768px) {
      .mobile-menu-button {
        display: none;
      }
    }

    /* Mobile menu */
    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--card-background);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      will-change: max-height, opacity;
      display: block; /* Ensure it's always block on mobile */
    }

    .mobile-menu-open {
      max-height: 80vh;
      opacity: 1;
      visibility: visible;
    }

    /* Ensure mobile menu is visible on mobile screens */
    @media (max-width: 767px) {
      .mobile-menu {
        display: block !important;
        position: absolute;
        width: 100%;
      }

      .mobile-menu-button {
        display: flex !important;
      }
    }

    /* Mobile menu backdrop */
    .mobile-menu-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 998;
    }

    .mobile-menu-backdrop-open {
      opacity: 1;
      visibility: visible;
    }

    @media (min-width: 768px) {
      .mobile-menu {
        display: none !important;
      }

      .mobile-menu-backdrop {
        display: none !important;
      }
    }

    .mobile-menu-content {
      padding: 1.5rem;
      display: flex !important;
      flex-direction: column !important;
      gap: 0.75rem;
      min-height: 0;
      width: 100%;
      box-sizing: border-box;
    }

    /* Mobile navigation links */
    .mobile-nav-link {
      display: flex !important;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1rem;
      color: var(--text-color);
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      min-height: 56px;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      flex-direction: row; /* Ensure icon and text are horizontal within each link */
    }

    .mobile-nav-link:hover,
    .mobile-nav-link:focus {
      background-color: var(--border-light);
      color: var(--primary-color);
      text-decoration: none;
      outline: none;
    }

    .mobile-nav-link:active {
      background-color: var(--primary-color);
      color: white;
      transform: scale(0.98);
    }

    .mobile-nav-button {
      border: none;
      background: transparent;
      cursor: pointer;
      width: 100%;
      text-align: left;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .mobile-nav-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .mobile-nav-button:hover:not(:disabled),
    .mobile-nav-button:focus:not(:disabled) {
      background-color: var(--border-light);
      color: var(--primary-color);
      outline: none;
    }

    .mobile-nav-button:active:not(:disabled) {
      background-color: var(--primary-color);
      color: white;
      transform: scale(0.98);
    }

    /* Mobile theme toggle */
    .mobile-theme-toggle {
      margin-bottom: 1rem;
      display: block;
    }

    /* Mobile navigation error */
    .mobile-nav-error {
      color: var(--danger-color);
      font-size: 0.875rem;
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: 0.5rem;
      border: 1px solid var(--danger-color);
    }

    @media (max-width: 767px) {
      .brand-logo {
        font-size: 1.25rem;
      }

      .navbar-container {
        padding: 0 1rem;
      }

      .navbar-content {
        height: 4rem;
      }

      .mobile-menu {
        left: 0;
        right: 0;
        width: 100% !important;
        display: block !important;
      }

      .mobile-menu-content {
        padding: 1rem;
        display: flex !important;
        flex-direction: column !important;
      }

      .mobile-nav-link {
        padding: 1rem;
        min-height: 52px;
        font-size: 1rem;
        display: flex !important;
        width: 100%;
      }

      /* Force desktop nav to be hidden */
      .desktop-nav {
        display: none !important;
        visibility: hidden !important;
      }

      /* Ensure mobile menu button is visible */
      .mobile-menu-button {
        display: flex !important;
      }
    }

    @media (max-width: 480px) {
      .brand-logo {
        font-size: 1.1rem;
        gap: 0.5rem;
      }

      .brand-logo .material-icons {
        font-size: 1.5rem;
      }

      .mobile-menu-content {
        padding: 0.75rem;
      }

      .mobile-nav-link {
        padding: 0.875rem;
        min-height: 48px;
        font-size: 0.95rem;
      }

      .mobile-menu-button {
        width: 44px;
        height: 44px;
      }
    }

    /* Mobile-specific overrides - highest priority */
    @media screen and (max-width: 767px) {
      /* Force mobile menu visibility and layout */
      .mobile-menu {
        display: block !important;
        position: absolute !important;
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
      }

      .mobile-menu-content {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        width: 100% !important;
      }

      .mobile-nav-link {
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
        justify-content: flex-start !important;
      }

      /* Force desktop navigation to be hidden */
      .desktop-nav {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      /* Ensure mobile button is visible */
      .mobile-menu-button {
        display: flex !important;
        visibility: visible !important;
      }

      /* Hardware acceleration for performance */
      .mobile-menu,
      .mobile-menu-content,
      .mobile-nav-link {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
    }

    @media (min-width: 1440px) {
      .navbar-container {
        max-width: 1600px;
        padding: 0 2rem;
      }
    }

    @media (min-width: 1920px) {
      .navbar-container {
        max-width: 1800px;
        padding: 0 2.5rem;
      }
    }
  `]
})
export class NavbarComponent implements OnDestroy {
  user$ = this.authService.user$;
  isLoading = false;
  error: string | null = null;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService) {
    this.user$.subscribe(user => {
      // User state changed
      // Close mobile menu when user state changes
      this.isMobileMenuOpen = false;
    });
  }

  // Listen for escape key to close mobile menu
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
      event.preventDefault();
    }
  }

  // Listen for window resize to close mobile menu when switching to desktop
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    const target = event.target as Window;
    if (target.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = ''; // Restore body scroll
  }

  signOut() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    this.closeMobileMenu(); // Close mobile menu when signing out
    try {
      this.authService.logout();
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Error signing out';
    } finally {
      this.isLoading = false;
    }
  }

  // Add cleanup on component destroy
  ngOnDestroy() {
    // Restore body scroll if component is destroyed while menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }
}