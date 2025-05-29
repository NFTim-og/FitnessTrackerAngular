import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { PaginationParams, PaginationResponse } from '../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = `${environment.apiUrl}/exercises`;
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);

  exercises$ = this.exercisesSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();
  data$ = this.exercises$; // Alias for backward compatibility

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  loadExercises(params: PaginationParams): Observable<void> {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'name')
      .set('sortOrder', params.sortOrder || 'ASC');

    console.log('ExerciseService - Loading exercises from:', `${this.apiUrl}`);
    console.log('ExerciseService - With params:', params);

    console.log('ExerciseService - Making HTTP request to:', `${this.apiUrl}`);
    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          console.log('ExerciseService - Response received:', response);
          console.log('ExerciseService - Response type:', typeof response);
          console.log('ExerciseService - Response status:', response?.status);
          console.log('ExerciseService - Response data:', response?.data);
          console.log('ExerciseService - Response data type:', typeof response?.data);
          console.log('ExerciseService - Response data.exercises:', response?.data?.exercises);
          console.log('ExerciseService - Is data.exercises an array:', Array.isArray(response?.data?.exercises));

          if (response && response.status === 'success' && response.data && Array.isArray(response.data.exercises)) {
            const exercises = response.data.exercises.map((e: any) => new Exercise(e));
            console.log('ExerciseService - Parsed exercises:', exercises);
            this.exercisesSubject.next(exercises);

            if (response.data.pagination && typeof response.data.pagination.total === 'number') {
              this.totalCountSubject.next(response.data.pagination.total);
            } else {
              this.totalCountSubject.next(exercises.length);
            }
          } else {
            console.error('ExerciseService - Invalid response format:', response);
            this.exercisesSubject.next([]);
            this.totalCountSubject.next(0);
          }
        }),
        catchError(error => {
          console.error('ExerciseService - Error loading exercises:', error);
          this.exercisesSubject.next([]);
          this.totalCountSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.loadExercises'));
        })
      );
  }

  getExercise(id: string): Observable<Exercise> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => new Exercise(response.data.exercise)),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.getExercise'));
        })
      );
  }

  createExercise(exercise: Omit<Exercise, 'id' | 'created_at' | 'created_by'>): Observable<Exercise> {
    console.log('ExerciseService - Creating exercise:', exercise);
    return this.http.post<any>(`${this.apiUrl}`, exercise)
      .pipe(
        map(response => {
          console.log('ExerciseService - Create exercise response:', response);

          if (response && response.status === 'success' && response.data && response.data.exercise) {
            const createdExercise = new Exercise(response.data.exercise);
            console.log('ExerciseService - Created exercise:', createdExercise);

            // Reload the exercises list
            this.loadExercises({ page: 1, perPage: 6 }).subscribe({
              next: () => console.log('ExerciseService - Exercises reloaded after creation'),
              error: (err) => console.error('ExerciseService - Error reloading exercises:', err)
            });

            return createdExercise;
          } else {
            console.error('ExerciseService - Invalid create response format:', response);
            throw new Error('Failed to create exercise: Invalid response format');
          }
        }),
        catchError(error => {
          console.error('ExerciseService - Error creating exercise:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.createExercise'));
        })
      );
  }

  updateExercise(id: string, exercise: Partial<Exercise>): Observable<Exercise> {
    console.log('ExerciseService - Updating exercise:', id, exercise);
    return this.http.put<any>(`${this.apiUrl}/${id}`, exercise)
      .pipe(
        map(response => {
          console.log('ExerciseService - Update exercise response:', response);

          if (response && response.status === 'success' && response.data && response.data.exercise) {
            const updatedExercise = new Exercise(response.data.exercise);
            console.log('ExerciseService - Updated exercise:', updatedExercise);

            // Reload the exercises list
            this.loadExercises({ page: 1, perPage: 6 }).subscribe({
              next: () => console.log('ExerciseService - Exercises reloaded after update'),
              error: (err) => console.error('ExerciseService - Error reloading exercises:', err)
            });

            return updatedExercise;
          } else {
            console.error('ExerciseService - Invalid update response format:', response);
            throw new Error('Failed to update exercise: Invalid response format');
          }
        }),
        catchError(error => {
          console.error('ExerciseService - Error updating exercise:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.updateExercise'));
        })
      );
  }

  deleteExercise(id: string): Observable<void> {
    console.log('ExerciseService - Deleting exercise:', id);
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('ExerciseService - Delete exercise response:', response);

          if (response && response.status === 'success') {
            console.log('ExerciseService - Exercise deleted successfully');

            // Reload the exercises list
            this.loadExercises({ page: 1, perPage: 6 }).subscribe({
              next: () => console.log('ExerciseService - Exercises reloaded after deletion'),
              error: (err) => console.error('ExerciseService - Error reloading exercises:', err)
            });
          } else {
            console.error('ExerciseService - Invalid delete response format:', response);
            throw new Error('Failed to delete exercise: Invalid response format');
          }
        }),
        catchError(error => {
          console.error('ExerciseService - Error deleting exercise:', error);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.deleteExercise'));
        })
      );
  }

  searchExercises(query: string, difficulty: string, params: PaginationParams): Observable<void> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'name')
      .set('sortOrder', params.sortOrder || 'ASC');

    if (query) {
      httpParams = httpParams.set('search', query);
    }

    if (difficulty) {
      httpParams = httpParams.set('difficulty', difficulty);
    }

    console.log('ExerciseService - Searching exercises with query:', query, 'difficulty:', difficulty);
    console.log('ExerciseService - Search params:', httpParams.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          console.log('ExerciseService - Search response:', response);

          if (response && response.status === 'success' && response.data && Array.isArray(response.data.exercises)) {
            const exercises = response.data.exercises.map((e: any) => new Exercise(e));
            console.log('ExerciseService - Search found exercises:', exercises.length);
            this.exercisesSubject.next(exercises);

            if (response.data.pagination && typeof response.data.pagination.total === 'number') {
              this.totalCountSubject.next(response.data.pagination.total);
            } else {
              this.totalCountSubject.next(exercises.length);
            }
          } else {
            console.error('ExerciseService - Invalid search response format:', response);
            this.exercisesSubject.next([]);
            this.totalCountSubject.next(0);
          }
        }),
        catchError(error => {
          console.error('ExerciseService - Error searching exercises:', error);
          this.exercisesSubject.next([]);
          this.totalCountSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'ExerciseService.searchExercises'));
        })
      );
  }
}
