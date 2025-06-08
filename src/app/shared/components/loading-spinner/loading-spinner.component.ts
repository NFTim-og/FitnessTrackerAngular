import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerColor = 'primary' | 'secondary' | 'white' | 'gray';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container" [ngClass]="containerClasses">
      <div
        class="spinner animate-spin"
        [ngClass]="spinnerClasses"
        role="status"
        [attr.aria-label]="message || 'Loading'"
      >
        <span class="sr-only">{{ message || 'Loading...' }}</span>
      </div>
      <span
        *ngIf="showMessage && message"
        class="spinner-message"
        [ngClass]="messageClasses"
      >
        {{ message }}
      </span>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      border-radius: 50%;
      border: 2px solid var(--border-color);
      border-top-color: transparent;
    }

    .spinner-message {
      margin-left: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* Overlay styles */
    .spinner-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.75);
      z-index: 10;
    }

    .spinner-fullscreen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 50;
    }

    /* Spinner sizes */
    .spinner-small {
      width: 1rem;
      height: 1rem;
      border-width: 2px;
    }

    .spinner-medium {
      width: 2rem;
      height: 2rem;
      border-width: 3px;
    }

    .spinner-large {
      width: 3rem;
      height: 3rem;
      border-width: 4px;
    }

    /* Spinner colors */
    .spinner-primary {
      border-color: var(--primary-color);
      border-top-color: transparent;
    }

    .spinner-secondary {
      border-color: var(--text-secondary);
      border-top-color: transparent;
    }

    .spinner-white {
      border-color: white;
      border-top-color: transparent;
    }

    .spinner-gray {
      border-color: var(--text-muted);
      border-top-color: transparent;
    }

    /* Message colors */
    .message-primary { color: var(--primary-color); }
    .message-secondary { color: var(--text-secondary); }
    .message-white { color: white; }
    .message-gray { color: var(--text-muted); }

    /* Dark mode support */
    :root.dark-mode .spinner-overlay {
      background-color: rgba(31, 41, 55, 0.75);
    }

    :root.dark-mode .spinner-fullscreen {
      background-color: rgba(31, 41, 55, 0.9);
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = 'medium';
  @Input() color: SpinnerColor = 'primary';
  @Input() message?: string;
  @Input() showMessage: boolean = false;
  @Input() overlay: boolean = false;
  @Input() fullScreen: boolean = false;

  get containerClasses(): string {
    const classes = [];

    if (this.overlay) {
      classes.push('spinner-overlay');
    }

    if (this.fullScreen) {
      classes.push('spinner-fullscreen');
    }

    return classes.join(' ');
  }

  get spinnerClasses(): string {
    const classes = [];

    // Size classes
    switch (this.size) {
      case 'small':
        classes.push('spinner-small');
        break;
      case 'large':
        classes.push('spinner-large');
        break;
      default: // medium
        classes.push('spinner-medium');
    }

    // Color classes
    switch (this.color) {
      case 'white':
        classes.push('spinner-white');
        break;
      case 'gray':
        classes.push('spinner-gray');
        break;
      case 'secondary':
        classes.push('spinner-secondary');
        break;
      default: // primary
        classes.push('spinner-primary');
    }

    return classes.join(' ');
  }

  get messageClasses(): string {
    const classes = [];

    switch (this.color) {
      case 'white':
        classes.push('message-white');
        break;
      case 'gray':
        classes.push('message-gray');
        break;
      case 'secondary':
        classes.push('message-secondary');
        break;
      default: // primary
        classes.push('message-primary');
    }

    return classes.join(' ');
  }
}
