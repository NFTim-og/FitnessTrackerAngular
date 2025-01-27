import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <nav class="bg-white shadow-md dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a routerLink="/" class="text-xl font-bold">Fitness Tracker</a>
          
          <div class="flex items-center gap-4">
            <app-theme-toggle></app-theme-toggle>
            @if (user$ | async; as user) {
              <a routerLink="/exercises" class="nav-link">Exercises</a>
              <a routerLink="/workout-plans" class="nav-link">Workout Plans</a>
              <button (click)="signOut()" class="nav-link sign-out-btn">Sign Out</button>
            } @else {
              <a routerLink="/auth/login" class="nav-link">Sign In</a>
              <a routerLink="/auth/register" class="nav-link">Register</a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      background-color: var(--card-background);
      color: var(--text-color);
      transition: background-color 0.3s, color 0.3s;
    }

    .nav-link {
      padding: 0.5rem;
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: var(--primary-color);
    }

    .sign-out-btn {
      background: none;
      border: 1px solid var(--text-color);
      border-radius: 4px;
      cursor: pointer;
      font-size: inherit;
      font-family: inherit;
      padding: 0.25rem 0.75rem;
      transition: all 0.2s ease;
    }

    .sign-out-btn:hover {
      background-color: var(--text-color);
      color: var(--card-background);
    }

    :host-context(.dark-mode) {
      nav {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }

      .nav-link {
        color: #f3f4f6;
      }

      .nav-link:hover {
        color: #60a5fa;
      }

      .sign-out-btn {
        border-color: #f3f4f6;
      }

      .sign-out-btn:hover {
        background-color: #f3f4f6;
        color: #1f2937;
      }
    }
  `]
})
export class NavbarComponent {
  user$ = this.supabaseService.user$;

  constructor(private supabaseService: SupabaseService) {}

  async signOut() {
    await this.supabaseService.signOut();
  }
}
