import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ErrorNotificationComponent } from './shared/components/error-notification/error-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NavbarComponent, ErrorNotificationComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Fitness Tracker';
}