import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppError } from '../models/error.model';

export interface ErrorNotification {
  id: string;
  error: AppError;
  context: string;
  timestamp: Date;
  dismissed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorsSubject = new BehaviorSubject<ErrorNotification[]>([]);
  private errorIdCounter = 0;

  // Observable stream of current errors
  errors$ = this.errorsSubject.asObservable();

  /**
   * Handle an error and optionally show it to the user
   * @param error - The error to handle
   * @param context - Context where the error occurred
   * @param showToUser - Whether to show this error to the user
   * @returns The processed AppError
   */
  handleError(error: any, context: string, showToUser: boolean = false): AppError {
    const appError = AppError.fromError(error);

    // Log error with context
    console.error(`Error in ${context}:`, {
      message: appError.message,
      code: appError.code,
      details: appError.details,
      stack: appError.stack
    });

    // Add to user-visible errors if requested
    if (showToUser) {
      this.addErrorNotification(appError, context);
    }

    return appError;
  }

  /**
   * Add an error notification for the user
   * @param error - The AppError to show
   * @param context - Context where the error occurred
   */
  private addErrorNotification(error: AppError, context: string): void {
    const notification: ErrorNotification = {
      id: `error_${++this.errorIdCounter}`,
      error,
      context,
      timestamp: new Date(),
      dismissed: false
    };

    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, notification]);

    // Auto-dismiss after 10 seconds for non-critical errors
    if (!this.isCriticalError(error)) {
      setTimeout(() => {
        this.dismissError(notification.id);
      }, 10000);
    }
  }

  /**
   * Dismiss an error notification
   * @param errorId - ID of the error to dismiss
   */
  dismissError(errorId: string): void {
    const currentErrors = this.errorsSubject.value;
    const updatedErrors = currentErrors.filter(error => error.id !== errorId);
    this.errorsSubject.next(updatedErrors);
  }

  /**
   * Clear all error notifications
   */
  clearAllErrors(): void {
    this.errorsSubject.next([]);
  }

  /**
   * Check if an error is critical and should not auto-dismiss
   * @param error - The AppError to check
   * @returns True if the error is critical
   */
  private isCriticalError(error: AppError): boolean {
    const criticalCodes = [
      'AUTHENTICATION_ERROR',
      'AUTHORIZATION_ERROR',
      'NETWORK_ERROR',
      'SERVER_ERROR'
    ];

    return criticalCodes.some(code => error.code?.includes(code));
  }

  /**
   * Get user-friendly error message
   * @param error - The AppError
   * @returns User-friendly message
   */
  getUserFriendlyMessage(error: AppError): string {
    const messageMap: { [key: string]: string } = {
      'HTTP_ERROR_401': 'Please log in to continue',
      'HTTP_ERROR_403': 'You do not have permission to perform this action',
      'HTTP_ERROR_404': 'The requested resource was not found',
      'HTTP_ERROR_500': 'Server error. Please try again later',
      'NETWORK_ERROR': 'Network connection error. Please check your internet connection',
      'VALIDATION_ERROR': 'Please check your input and try again'
    };

    return messageMap[error.code || ''] || error.message || 'An unexpected error occurred';
  }
}