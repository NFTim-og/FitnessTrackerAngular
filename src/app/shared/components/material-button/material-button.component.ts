import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'text' | 'outlined';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-material-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
      matRipple
      [matRippleDisabled]="disabled || loading"
    >
      @if (loading) {
        <div class="loading-spinner" [class]="spinnerClasses"></div>
      } @else if (icon) {
        <span class="material-icons" [class]="iconClasses">{{ icon }}</span>
      }
      
      @if (label || !icon) {
        <span [class]="labelClasses">
          <ng-content>{{ label }}</ng-content>
        </span>
      }
    </button>
  `,
  styles: [`
    .loading-spinner {
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    .loading-spinner.small {
      width: 14px;
      height: 14px;
    }
    
    .loading-spinner.medium {
      width: 16px;
      height: 16px;
    }
    
    .loading-spinner.large {
      width: 18px;
      height: 18px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .btn-base {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-family: 'Inter', sans-serif;
      white-space: nowrap;
      text-decoration: none;
      position: relative;
      overflow: hidden;
    }
    
    .btn-base:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Size variants */
    .btn-small {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      min-width: 80px;
    }
    
    .btn-medium {
      padding: 0.625rem 1.25rem;
      font-size: 1rem;
      min-width: 100px;
    }
    
    .btn-large {
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
      min-width: 120px;
    }
    
    /* Color variants */
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: var(--secondary-color);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-secondary {
      background-color: var(--text-muted);
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background-color: var(--text-secondary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-danger {
      background-color: var(--danger-color);
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-warning {
      background-color: var(--warning-color);
      color: white;
    }
    
    .btn-warning:hover:not(:disabled) {
      background-color: #d97706;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-success {
      background-color: var(--success-color);
      color: white;
    }
    
    .btn-success:hover:not(:disabled) {
      background-color: #16a34a;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-text {
      background-color: transparent;
      color: var(--primary-color);
      padding: 0.5rem;
      min-width: auto;
    }
    
    .btn-text:hover:not(:disabled) {
      background-color: rgba(59, 130, 246, 0.1);
    }
    
    .btn-outlined {
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
    
    .btn-outlined:hover:not(:disabled) {
      background-color: var(--primary-color);
      color: white;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    /* Icon spacing */
    .icon-left {
      margin-right: 0.5rem;
    }
    
    .icon-only {
      margin: 0;
    }
    
    .icon-small {
      font-size: 1rem;
    }
    
    .icon-medium {
      font-size: 1.125rem;
    }
    
    .icon-large {
      font-size: 1.25rem;
    }
    
    /* Responsive design */
    @media (max-width: 640px) {
      .btn-base:not(.btn-text) {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class MaterialButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() label?: string;
  @Input() fullWidth: boolean = false;
  
  @Output() clicked = new EventEmitter<Event>();
  
  get buttonClasses(): string {
    const classes = [
      'btn-base',
      `btn-${this.size}`,
      `btn-${this.variant}`
    ];
    
    if (this.fullWidth) {
      classes.push('w-full');
    }
    
    return classes.join(' ');
  }
  
  get iconClasses(): string {
    const classes = [`icon-${this.size}`];
    
    if (this.label) {
      classes.push('icon-left');
    } else {
      classes.push('icon-only');
    }
    
    return classes.join(' ');
  }
  
  get labelClasses(): string {
    return this.icon && !this.loading ? 'ml-1' : '';
  }
  
  get spinnerClasses(): string {
    return this.size;
  }
  
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
