import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  [key: string]: boolean;
}

/**
 * Loading Service
 * Manages loading states for different operations across the application
 * Provides centralized loading state management with operation-specific tracking
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({});
  
  // Observable stream of loading states
  loading$ = this.loadingSubject.asObservable();

  /**
   * Set loading state for a specific operation
   * @param operation - Unique identifier for the operation
   * @param isLoading - Whether the operation is loading
   */
  setLoading(operation: string, isLoading: boolean): void {
    const currentState = this.loadingSubject.value;
    const newState = { ...currentState };
    
    if (isLoading) {
      newState[operation] = true;
    } else {
      delete newState[operation];
    }
    
    this.loadingSubject.next(newState);
  }

  /**
   * Check if a specific operation is loading
   * @param operation - Operation identifier
   * @returns True if the operation is loading
   */
  isLoading(operation: string): Observable<boolean> {
    return new Observable(observer => {
      this.loading$.subscribe(state => {
        observer.next(!!state[operation]);
      });
    });
  }

  /**
   * Check if any operation is loading
   * @returns True if any operation is loading
   */
  isAnyLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.loading$.subscribe(state => {
        observer.next(Object.keys(state).length > 0);
      });
    });
  }

  /**
   * Get all current loading operations
   * @returns Array of operation names that are currently loading
   */
  getLoadingOperations(): Observable<string[]> {
    return new Observable(observer => {
      this.loading$.subscribe(state => {
        observer.next(Object.keys(state));
      });
    });
  }

  /**
   * Clear all loading states
   */
  clearAll(): void {
    this.loadingSubject.next({});
  }

  /**
   * Start loading for an operation
   * @param operation - Operation identifier
   */
  start(operation: string): void {
    this.setLoading(operation, true);
  }

  /**
   * Stop loading for an operation
   * @param operation - Operation identifier
   */
  stop(operation: string): void {
    this.setLoading(operation, false);
  }

  /**
   * Execute an operation with automatic loading state management
   * @param operation - Operation identifier
   * @param task - Promise or Observable to execute
   * @returns Promise that resolves when the task completes
   */
  async withLoading<T>(operation: string, task: Promise<T>): Promise<T> {
    try {
      this.start(operation);
      const result = await task;
      return result;
    } finally {
      this.stop(operation);
    }
  }

  /**
   * Execute an Observable operation with automatic loading state management
   * @param operation - Operation identifier
   * @param task - Observable to execute
   * @returns Observable that manages loading state
   */
  withLoadingObservable<T>(operation: string, task: Observable<T>): Observable<T> {
    return new Observable(observer => {
      this.start(operation);
      
      const subscription = task.subscribe({
        next: (value) => observer.next(value),
        error: (error) => {
          this.stop(operation);
          observer.error(error);
        },
        complete: () => {
          this.stop(operation);
          observer.complete();
        }
      });

      // Return cleanup function
      return () => {
        this.stop(operation);
        subscription.unsubscribe();
      };
    });
  }
}
