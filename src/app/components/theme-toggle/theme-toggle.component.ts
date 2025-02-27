import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styles: [`
    .theme-toggle {
      padding: 0.5rem;
      border-radius: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      transition: color 0.2s, transform 0.2s;
    }
    
    .theme-toggle:hover {
      color: var(--primary-color);
      transform: scale(1.1);
    }
    
    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  `]
})
export class ThemeToggleComponent {
  isDarkMode$ = this.themeService.darkMode$;

  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}