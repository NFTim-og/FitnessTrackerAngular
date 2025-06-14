import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WorkoutPlan } from '../models/workout-plan.model';
import { PaginationParams } from '../shared/models/pagination.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanService {
  private apiUrl = `${environment.apiUrl}/workout-plans`;
  private workoutPlansSubject = new BehaviorSubject<WorkoutPlan[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private currentParams: PaginationParams = { page: 1, perPage: 1 };

  workoutPlans$ = this.workoutPlansSubject.asObservable();
  totalCount$ = this.totalCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  loadWorkoutPlans(params: PaginationParams): Observable<void> {
    this.currentParams = params;

    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'created_at')
      .set('sortOrder', params.sortOrder || 'DESC');

    console.log('WorkoutPlanService - Loading workout plans from:', `${this.apiUrl}`);
    console.log('WorkoutPlanService - With params:', params);

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          // Process the response and update the BehaviorSubjects
          if (response && response.status === 'success' && response.data && Array.isArray(response.data)) {
            // Convert raw data to WorkoutPlan objects
            const workoutPlans = response.data.map((wp: any) => WorkoutPlan.fromJSON(wp));

            // Update the workout plans subject with new data
            this.workoutPlansSubject.next(workoutPlans);

            // Update the total count for pagination
            if (response.pagination && response.pagination.totalCount !== undefined) {
              const totalCount = typeof response.pagination.totalCount === 'string'
                ? parseInt(response.pagination.totalCount, 10)
                : response.pagination.totalCount;
              this.totalCountSubject.next(totalCount);
            } else {
              this.totalCountSubject.next(workoutPlans.length);
            }
          } else {
            this.workoutPlansSubject.next([]);
            this.totalCountSubject.next(0);
          }
        }),
        catchError(error => {
          console.error('WorkoutPlanService - Error loading workout plans:', error);
          this.workoutPlansSubject.next([]);
          this.totalCountSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.loadWorkoutPlans', true));
        })
      );
  }

  getWorkoutPlan(id: string): Observable<WorkoutPlan> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => WorkoutPlan.fromJSON(response.data.workoutPlan)),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.getWorkoutPlan', true));
        })
      );
  }

  createWorkoutPlan(
    workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'created_by'>,
    exercises: { exercise_id: string; order: number }[]
  ): Observable<WorkoutPlan> {
    const payload = {
      name: workoutPlan.name,
      description: workoutPlan.description,
      exercises: exercises
    };

    return this.http.post<any>(`${this.apiUrl}`, payload)
      .pipe(
        map(response => {
          // Reload workout plans with newest first to show the new plan
          this.loadWorkoutPlans({ page: 1, perPage: 6, sortBy: 'created_at', sortOrder: 'DESC' }).subscribe();
          return WorkoutPlan.fromJSON(response.data.workoutPlan);
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.createWorkoutPlan', true));
        })
      );
  }

  updateWorkoutPlan(
    id: string,
    workoutPlan: Partial<WorkoutPlan>,
    exercises?: { exercise_id: string; order: number }[]
  ): Observable<WorkoutPlan> {
    const payload: any = {};

    if (workoutPlan.name) {
      payload.name = workoutPlan.name;
    }

    if (workoutPlan.description !== undefined) {
      payload.description = workoutPlan.description;
    }

    if (exercises) {
      payload.exercises = exercises;
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        map(response => {
          this.loadWorkoutPlans(this.currentParams).subscribe();
          return WorkoutPlan.fromJSON(response.data.workoutPlan);
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.updateWorkoutPlan', true));
        })
      );
  }

  deleteWorkoutPlan(id: string): Observable<void> {
    console.log('WorkoutPlanService - Deleting workout plan:', id);

    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('WorkoutPlanService - Delete workout plan response:', response);

          // Validate response format
          if (response && response.status === 'success') {
            console.log('WorkoutPlanService - Workout plan deleted successfully');

            // Remove the deleted workout plan from the current list
            const currentWorkoutPlans = this.workoutPlansSubject.value;
            const updatedWorkoutPlans = currentWorkoutPlans.filter(plan => plan.id !== id);
            this.workoutPlansSubject.next(updatedWorkoutPlans);

            // Update total count
            const currentCount = this.totalCountSubject.value;
            this.totalCountSubject.next(Math.max(0, currentCount - 1));

            console.log('WorkoutPlanService - Workout plan list updated after deletion');
          } else {
            // Handle invalid response format
            console.error('WorkoutPlanService - Invalid delete response format:', response);
            throw new Error('Failed to delete workout plan: Invalid response format');
          }
        }),
        catchError(error => {
          console.error('WorkoutPlanService - Error deleting workout plan:', error);
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.deleteWorkoutPlan', true));
        })
      );
  }

  searchWorkoutPlans(query: string, params: PaginationParams): Observable<void> {
    this.currentParams = params;

    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'created_at')
      .set('sortOrder', params.sortOrder || 'DESC')
      .set('search', query);

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.data && Array.isArray(response.data)) {
            const workoutPlans = response.data.map((wp: any) => WorkoutPlan.fromJSON(wp));
            this.workoutPlansSubject.next(workoutPlans);

            if (response.pagination && response.pagination.totalCount !== undefined) {
              const totalCount = typeof response.pagination.totalCount === 'string'
                ? parseInt(response.pagination.totalCount, 10)
                : response.pagination.totalCount;
              this.totalCountSubject.next(totalCount);
            } else {
              this.totalCountSubject.next(workoutPlans.length);
            }
          } else {
            this.workoutPlansSubject.next([]);
            this.totalCountSubject.next(0);
          }
        }),
        catchError(error => {
          this.workoutPlansSubject.next([]);
          this.totalCountSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.searchWorkoutPlans', true));
        })
      );
  }
}
