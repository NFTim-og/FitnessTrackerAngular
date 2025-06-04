import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorHandlerService, ErrorNotification } from '../../services/error-handler.service';
import { ErrorSeverity } from '../../models/error.model';

@Component({
  selector: 'app-error-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        *ngFor="let notification of errorNotifications"
        class="max-w-sm rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out"
        [ngClass]="getErrorClasses(notification)"
        role="alert"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5"
              [ngClass]="getIconClasses(notification)"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                *ngIf="notification.error.severity === 'critical'"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
              <path
                *ngIf="notification.error.severity === 'high'"
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
              <path
                *ngIf="notification.error.severity === 'medium' || notification.error.severity === 'low'"
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium" [ngClass]="getTitleClasses(notification)">
              {{ getErrorTitle(notification) }}
            </h3>
            <div class="mt-1 text-sm" [ngClass]="getMessageClasses(notification)">
              {{ notification.error.getUserDescription() }}
            </div>
            <div class="mt-2 text-xs" [ngClass]="getContextClasses(notification)">
              {{ notification.context }} • {{ notification.timestamp | date:'short' }}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              [ngClass]="getCloseButtonClasses(notification)"
              (click)="dismissError(notification.id)"
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-notification-enter {
      opacity: 0;
      transform: translateX(100%);
    }
    
    .error-notification-enter-active {
      opacity: 1;
      transform: translateX(0);
      transition: all 300ms ease-in-out;
    }
    
    .error-notification-leave-active {
      opacity: 0;
      transform: translateX(100%);
      transition: all 300ms ease-in-out;
    }
  `]
})
export class ErrorNotificationComponent implements OnInit, OnDestroy {
  errorNotifications: ErrorNotification[] = [];
  private subscription?: Subscription;

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.subscription = this.errorHandler.errors$.subscribe(
      errors => this.errorNotifications = errors
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  dismissError(errorId: string): void {
    this.errorHandler.dismissError(errorId);
  }

  getErrorTitle(notification: ErrorNotification): string {
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'Critical Error';
      case ErrorSeverity.HIGH:
        return 'Error';
      case ErrorSeverity.MEDIUM:
        return 'Warning';
      case ErrorSeverity.LOW:
        return 'Notice';
      default:
        return 'Notification';
    }
  }

  getErrorClasses(notification: ErrorNotification): string {
    const baseClasses = 'border-l-4';
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return `${baseClasses} bg-red-50 border-red-400`;
      case ErrorSeverity.HIGH:
        return `${baseClasses} bg-orange-50 border-orange-400`;
      case ErrorSeverity.MEDIUM:
        return `${baseClasses} bg-yellow-50 border-yellow-400`;
      case ErrorSeverity.LOW:
        return `${baseClasses} bg-blue-50 border-blue-400`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-400`;
    }
  }

  getIconClasses(notification: ErrorNotification): string {
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'text-red-400';
      case ErrorSeverity.HIGH:
        return 'text-orange-400';
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-400';
      case ErrorSeverity.LOW:
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  getTitleClasses(notification: ErrorNotification): string {
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'text-red-800';
      case ErrorSeverity.HIGH:
        return 'text-orange-800';
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-800';
      case ErrorSeverity.LOW:
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  }

  getMessageClasses(notification: ErrorNotification): string {
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'text-red-700';
      case ErrorSeverity.HIGH:
        return 'text-orange-700';
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-700';
      case ErrorSeverity.LOW:
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  }

  getContextClasses(notification: ErrorNotification): string {
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'text-red-500';
      case ErrorSeverity.HIGH:
        return 'text-orange-500';
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-500';
      case ErrorSeverity.LOW:
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getCloseButtonClasses(notification: ErrorNotification): string {
    switch (notification.error.severity) {
      case ErrorSeverity.CRITICAL:
        return 'text-red-400 hover:text-red-600 focus:ring-red-500';
      case ErrorSeverity.HIGH:
        return 'text-orange-400 hover:text-orange-600 focus:ring-orange-500';
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500';
      case ErrorSeverity.LOW:
        return 'text-blue-400 hover:text-blue-600 focus:ring-blue-500';
      default:
        return 'text-gray-400 hover:text-gray-600 focus:ring-gray-500';
    }
  }
}
