import { Component } from '@angular/core';
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
    .nav-link {
      padding: 0.5rem;
      background: var(--button-background);
      border: 1px solid transparent;
      cursor: pointer;
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-link:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .nav-link:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class NavbarComponent {
  user$ = this.authService.user$;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService) {
    console.log('NavbarComponent - Initializing');
    this.user$.subscribe(user => {
      console.log('NavbarComponent - User state changed:', user);
    });
  }

  signOut() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.error = null;
    try {
      this.authService.logout();
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Error signing out';
    } finally {
      this.isLoading = false;
    }
  }
}