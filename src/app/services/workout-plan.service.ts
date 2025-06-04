import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WorkoutPlan, WorkoutExercise } from '../models/workout-plan.model';
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
      .set('sortBy', params.sortBy || 'name')
      .set('sortOrder', params.sortOrder || 'ASC');

    console.log('WorkoutPlanService - Loading workout plans from:', `${this.apiUrl}`);
    console.log('WorkoutPlanService - With params:', params);

    // TEMPORARY: Use hardcoded dummy data instead of making an HTTP request
    console.log('WorkoutPlanService - Using hardcoded dummy data');

    // Create dummy workout plans
    const dummyWorkoutPlans = [
      WorkoutPlan.fromJSON({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Full Body Workout',
        description: 'A complete workout targeting all major muscle groups',
        created_by: '00000000-0000-0000-0000-000000000099',
        exercises: [
          {
            id: '00000000-0000-0000-0000-000000000101',
            workout_plan_id: '00000000-0000-0000-0000-000000000001',
            exercise_id: '00000000-0000-0000-0000-000000000001',
            order: 1,
            exercise: {
              id: '00000000-0000-0000-0000-000000000001',
              name: 'Push-ups',
              duration: 10,
              calories: 100,
              difficulty: 'medium',
              met_value: 3.8,
              created_by: '00000000-0000-0000-0000-000000000099'
            }
          },
          {
            id: '00000000-0000-0000-0000-000000000102',
            workout_plan_id: '00000000-0000-0000-0000-000000000001',
            exercise_id: '00000000-0000-0000-0000-000000000002',
            order: 2,
            exercise: {
              id: '00000000-0000-0000-0000-000000000002',
              name: 'Sit-ups',
              duration: 10,
              calories: 80,
              difficulty: 'easy',
              met_value: 3.0,
              created_by: '00000000-0000-0000-0000-000000000099'
            }
          }
        ]
      }),
      WorkoutPlan.fromJSON({
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Upper Body Strength',
        description: 'Focus on building upper body strength',
        created_by: '00000000-0000-0000-0000-000000000099',
        exercises: [
          {
            id: '00000000-0000-0000-0000-000000000201',
            workout_plan_id: '00000000-0000-0000-0000-000000000002',
            exercise_id: '00000000-0000-0000-0000-000000000001',
            order: 1,
            exercise: {
              id: '00000000-0000-0000-0000-000000000001',
              name: 'Push-ups',
              duration: 10,
              calories: 100,
              difficulty: 'medium',
              met_value: 3.8,
              created_by: '00000000-0000-0000-0000-000000000099'
            }
          }
        ]
      }),
      WorkoutPlan.fromJSON({
        id: '00000000-0000-0000-0000-000000000003',
        name: 'Core Strength',
        description: 'Focus on building core strength',
        created_by: '00000000-0000-0000-0000-000000000099',
        exercises: [
          {
            id: '00000000-0000-0000-0000-000000000301',
            workout_plan_id: '00000000-0000-0000-0000-000000000003',
            exercise_id: '00000000-0000-0000-0000-000000000002',
            order: 1,
            exercise: {
              id: '00000000-0000-0000-0000-000000000002',
              name: 'Sit-ups',
              duration: 10,
              calories: 80,
              difficulty: 'easy',
              met_value: 3.0,
              created_by: '00000000-0000-0000-0000-000000000099'
            }
          },
          {
            id: '00000000-0000-0000-0000-000000000302',
            workout_plan_id: '00000000-0000-0000-0000-000000000003',
            exercise_id: '00000000-0000-0000-0000-000000000005',
            order: 2,
            exercise: {
              id: '00000000-0000-0000-0000-000000000005',
              name: 'Plank',
              duration: 5,
              calories: 50,
              difficulty: 'hard',
              met_value: 4.0,
              created_by: '00000000-0000-0000-0000-000000000099'
            }
          }
        ]
      })
    ];

    console.log('WorkoutPlanService - Dummy workout plans:', dummyWorkoutPlans);
    this.workoutPlansSubject.next(dummyWorkoutPlans);
    this.totalCountSubject.next(dummyWorkoutPlans.length);

    return of(undefined).pipe(
        map(() => {
          // This is just a placeholder to maintain the Observable<void> return type
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
          this.loadWorkoutPlans(this.currentParams).subscribe();
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
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => {
          this.loadWorkoutPlans(this.currentParams).subscribe();
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.deleteWorkoutPlan', true));
        })
      );
  }

  searchWorkoutPlans(query: string, params: PaginationParams): Observable<void> {
    this.currentParams = params;

    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortBy', params.sortBy || 'name')
      .set('sortOrder', params.sortOrder || 'ASC')
      .set('search', query);

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        map(response => {
          const workoutPlans = response.data.workoutPlans.map((wp: any) => WorkoutPlan.fromJSON(wp));
          this.workoutPlansSubject.next(workoutPlans);
          this.totalCountSubject.next(response.data.pagination.total);
        }),
        catchError(error => {
          this.workoutPlansSubject.next([]);
          this.totalCountSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'WorkoutPlanService.searchWorkoutPlans', true));
        })
      );
  }
}
