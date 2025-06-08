import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ErrorNotificationComponent } from './shared/components/error-notification/error-notification.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavbarComponent, ErrorNotificationComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'Fitness Tracker';

  constructor(private themeService: ThemeService) {
    // Initialize theme service to ensure it's loaded early
    console.log('AppComponent - Theme service initialized');
  }

  ngOnInit() {
    // Add theme-initialized class to body to indicate theme system is ready
    document.body.classList.add('theme-initialized');
    console.log('AppComponent - Theme initialization complete');
  }
}