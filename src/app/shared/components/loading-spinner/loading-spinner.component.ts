import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerColor = 'primary' | 'secondary' | 'white' | 'gray';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [ngClass]="containerClasses">
      <div
        class="animate-spin rounded-full border-solid border-t-transparent"
        [ngClass]="spinnerClasses"
        role="status"
        [attr.aria-label]="message || 'Loading'"
      >
        <span class="sr-only">{{ message || 'Loading...' }}</span>
      </div>
      <span 
        *ngIf="showMessage && message" 
        class="ml-3 text-sm font-medium"
        [ngClass]="messageClasses"
      >
        {{ message }}
      </span>
    </div>
  `,
  styles: [`
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
      classes.push('absolute inset-0 bg-white bg-opacity-75 z-10');
    }
    
    if (this.fullScreen) {
      classes.push('fixed inset-0 bg-white bg-opacity-90 z-50');
    }
    
    return classes.join(' ');
  }

  get spinnerClasses(): string {
    const classes = [];
    
    // Size classes
    switch (this.size) {
      case 'small':
        classes.push('h-4 w-4 border-2');
        break;
      case 'medium':
        classes.push('h-8 w-8 border-3');
        break;
      case 'large':
        classes.push('h-12 w-12 border-4');
        break;
    }
    
    // Color classes
    switch (this.color) {
      case 'primary':
        classes.push('border-blue-600');
        break;
      case 'secondary':
        classes.push('border-gray-600');
        break;
      case 'white':
        classes.push('border-white');
        break;
      case 'gray':
        classes.push('border-gray-400');
        break;
    }
    
    return classes.join(' ');
  }

  get messageClasses(): string {
    const classes = [];
    
    switch (this.color) {
      case 'primary':
        classes.push('text-blue-600');
        break;
      case 'secondary':
        classes.push('text-gray-600');
        break;
      case 'white':
        classes.push('text-white');
        break;
      case 'gray':
        classes.push('text-gray-500');
        break;
    }
    
    return classes.join(' ');
  }
}
