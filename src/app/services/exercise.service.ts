/**
 * Exercise Service
 * Handles all API interactions related to exercises
 */

import { Injectable } from '@angular/core'; // Angular dependency injection
import { HttpClient, HttpParams } from '@angular/common/http'; // HTTP client for API requests
import { BehaviorSubject, Observable, throwError } from 'rxjs'; // Reactive programming utilities
import { catchError, map, finalize } from 'rxjs/operators'; // RxJS operators
import { Exercise } from '../models/exercise.model'; // Exercise model
import { environment } from '../../environments/environment'; // Environment configuration
import { ErrorHandlerService } from '../shared/services/error-handler.service'; // Error handling service
import { LoadingService } from '../shared/services/loading.service'; // Loading state management
import { PaginationParams, PaginationResponse } from '../shared/models/pagination.model'; // Pagination models

/**
 * Exercise Service
 * Injectable service that manages exercise data and API interactions
 */
@Injectable({
  providedIn: 'root' // Service is provided at the root level (singleton)
})
export class ExerciseService {
  // API endpoint for exercises
  private apiUrl = `${environment.apiUrl}/exercises`;

  // BehaviorSubjects to store and emit exercise data
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);

  // Observable streams that components can subscribe to
  exercises$ = this.exercisesSubject.asObservable(); // Current exercises list
  totalCount$ = this.totalCountSubject.asObservable(); // Total count for pagination
  data$ = this.exercises$; // Alias for backward compatibility

  /**
   * Constructor
   * @param http - Angular HTTP client for making API requests
   * @param errorHandler - Service for handling and formatting errors
   */
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private loadingService: LoadingService
  ) {}

  /**
   * Load exercises with pagination, sorting and filtering
   * Uses Angular HttpClient for consistent API communication
   *
   * @param params - Pagination parameters (page, perPage, sortBy, sortOrder)
   * @returns Observable that completes when data is loaded
   */
  loadExercises(params: PaginationParams): Observable<void> {
    // Build query parameters for the HTTP request
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'name')
      .set('sortOrder', params.sortOrder || 'ASC');

    console.log('ExerciseService - Loading exercises from:', `${this.apiUrl}`);
    console.log('ExerciseService - With params:', params);

    this.loadingService.start('loadExercises');

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          console.log('ExerciseService - HttpClient response:', response);

          // Process the response and update the BehaviorSubjects
          if (response && response.status === 'success' && response.data && Array.isArray(response.data.exercises)) {
            // Convert raw data to Exercise objects
            const exercises = response.data.exercises.map((e: any) => new Exercise(e));
            console.log('ExerciseService - Parsed exercises:', exercises);

            // Update the exercises subject with new data
            this.exercisesSubject.next(exercises);

            // Update the total count for pagination
            if (response.data.pagination && typeof response.data.pagination.total === 'number') {
              this.totalCountSubject.next(response.data.pagination.total);
            } else {
              this.totalCountSubject.next(exercises.length);
            }
          }
        }),
        catchError(error => {
          console.error('ExerciseService - Error loading exercises:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.loadExercises', true));
        }),
        finalize(() => {
          this.loadingService.stop('loadExercises');
        })
      );
  }

  /**
   * Get a specific exercise by ID
   *
   * @param id - Exercise ID to retrieve
   * @returns Observable of Exercise object
   */
  getExercise(id: string): Observable<Exercise> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        // Convert API response to Exercise object
        map(response => new Exercise(response.data.exercise)),
        // Handle and format any errors
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.getExercise', true));
        })
      );
  }

  /**
   * Create a new exercise
   *
   * @param exercise - Exercise data without ID, created_at, and created_by fields
   * @returns Observable of the created Exercise
   */
  createExercise(exercise: Omit<Exercise, 'id' | 'created_at' | 'created_by'>): Observable<Exercise> {
    console.log('ExerciseService - Creating exercise:', exercise);

    this.loadingService.start('createExercise');

    // Send POST request to create exercise
    return this.http.post<any>(`${this.apiUrl}`, exercise)
      .pipe(
        map(response => {
          console.log('ExerciseService - Create exercise response:', response);

          // Validate response format
          if (response && response.status === 'success' && response.data && response.data.exercise) {
            // Convert API response to Exercise object
            const createdExercise = new Exercise(response.data.exercise);
            console.log('ExerciseService - Created exercise:', createdExercise);

            // Reload the exercises list to update the UI
            this.loadExercises({ page: 1, perPage: 6 }).subscribe({
              next: () => console.log('ExerciseService - Exercises reloaded after creation'),
              error: (err) => console.error('ExerciseService - Error reloading exercises:', err)
            });

            return createdExercise;
          } else {
            // Handle invalid response format
            console.error('ExerciseService - Invalid create response format:', response);
            throw new Error('Failed to create exercise: Invalid response format');
          }
        }),
        // Handle and format any errors
        catchError(error => {
          console.error('ExerciseService - Error creating exercise:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.createExercise', true));
        }),
        finalize(() => {
          this.loadingService.stop('createExercise');
        })
      );
  }

  /**
   * Update an existing exercise
   *
   * @param id - ID of the exercise to update
   * @param exercise - Partial exercise data with fields to update
   * @returns Observable of the updated Exercise
   */
  updateExercise(id: string, exercise: Partial<Exercise>): Observable<Exercise> {
    console.log('ExerciseService - Updating exercise:', id, exercise);

    // Send PUT request to update exercise
    return this.http.put<any>(`${this.apiUrl}/${id}`, exercise)
      .pipe(
        map(response => {
          console.log('ExerciseService - Update exercise response:', response);

          // Validate response format
          if (response && response.status === 'success' && response.data && response.data.exercise) {
            // Convert API response to Exercise object
            const updatedExercise = new Exercise(response.data.exercise);
            console.log('ExerciseService - Updated exercise:', updatedExercise);

            // Reload the exercises list to update the UI
            this.loadExercises({ page: 1, perPage: 6 }).subscribe({
              next: () => console.log('ExerciseService - Exercises reloaded after update'),
              error: (err) => console.error('ExerciseService - Error reloading exercises:', err)
            });

            return updatedExercise;
          } else {
            // Handle invalid response format
            console.error('ExerciseService - Invalid update response format:', response);
            throw new Error('Failed to update exercise: Invalid response format');
          }
        }),
        // Handle and format any errors
        catchError(error => {
          console.error('ExerciseService - Error updating exercise:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.updateExercise', true));
        })
      );
  }

  /**
   * Delete an exercise
   *
   * @param id - ID of the exercise to delete
   * @returns Observable that completes when deletion is successful
   */
  deleteExercise(id: string): Observable<void> {
    console.log('ExerciseService - Deleting exercise:', id);

    // Send DELETE request
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('ExerciseService - Delete exercise response:', response);

          // Validate response format
          if (response && response.status === 'success') {
            console.log('ExerciseService - Exercise deleted successfully');

            // Reload the exercises list to update the UI
            this.loadExercises({ page: 1, perPage: 6 }).subscribe({
              next: () => console.log('ExerciseService - Exercises reloaded after deletion'),
              error: (err) => console.error('ExerciseService - Error reloading exercises:', err)
            });
          } else {
            // Handle invalid response format
            console.error('ExerciseService - Invalid delete response format:', response);
            throw new Error('Failed to delete exercise: Invalid response format');
          }
        }),
        // Handle and format any errors
        catchError(error => {
          console.error('ExerciseService - Error deleting exercise:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.deleteExercise', true));
        })
      );
  }

  /**
   * Search exercises with filters
   *
   * @param query - Search term for exercise name
   * @param difficulty - Filter by difficulty level
   * @param params - Pagination parameters
   * @returns Observable that completes when search is done
   */
  searchExercises(query: string, difficulty: string, params: PaginationParams): Observable<void> {
    // Build query parameters for the HTTP request
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'name')
      .set('sortOrder', params.sortOrder || 'ASC');

    // Add search term if provided
    if (query) {
      httpParams = httpParams.set('search', query);
    }

    // Add difficulty filter if provided
    if (difficulty) {
      httpParams = httpParams.set('difficulty', difficulty);
    }

    console.log('ExerciseService - Searching exercises with query:', query, 'difficulty:', difficulty);
    console.log('ExerciseService - Search params:', httpParams.toString());

    // Send GET request with search parameters
    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          console.log('ExerciseService - Search response:', response);

          // Validate and process response
          if (response && response.status === 'success' && response.data && Array.isArray(response.data.exercises)) {
            // Convert raw data to Exercise objects
            const exercises = response.data.exercises.map((e: any) => new Exercise(e));
            console.log('ExerciseService - Search found exercises:', exercises.length);

            // Update the exercises subject with search results
            this.exercisesSubject.next(exercises);

            // Update the total count for pagination
            if (response.data.pagination && typeof response.data.pagination.total === 'number') {
              this.totalCountSubject.next(response.data.pagination.total);
            } else {
              this.totalCountSubject.next(exercises.length);
            }
          } else {
            // Handle invalid response format
            console.error('ExerciseService - Invalid search response format:', response);
            this.exercisesSubject.next([]);
            this.totalCountSubject.next(0);
          }
        }),
        // Handle and format any errors
        catchError(error => {
          console.error('ExerciseService - Error searching exercises:', error);
          // Clear data on error
          this.exercisesSubject.next([]);
          this.totalCountSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.searchExercises'));
        })
      );
  }
}
