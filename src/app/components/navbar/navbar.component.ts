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
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a routerLink="/" class="text-xl font-bold">Fitness Tracker</a>
          
          <div class="flex items-center gap-4">
            <app-theme-toggle></app-theme-toggle>
            @if (user$ | async; as user) {
              <a routerLink="/exercises" class="nav-link">Exercises</a>
              <a routerLink="/workout-plans" class="nav-link">Workout Plans</a>
              <a routerLink="/profile" class="nav-link">Profile</a>
              <button (click)="signOut()" class="nav-link">Sign Out</button>
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
    .nav-link {
      padding: 0.5rem;
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-link:hover {
      color: var(--primary-color);
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