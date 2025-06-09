import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { UserProfile, WeightRecord } from '../models/user-profile.model';
import { PaginationParams } from '../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  private weightHistorySubject = new BehaviorSubject<WeightRecord[]>([]);
  private totalWeightRecordsSubject = new BehaviorSubject<number>(0);

  profile$ = this.profileSubject.asObservable();
  weightHistory$ = this.weightHistorySubject.asObservable();
  totalWeightRecords$ = this.totalWeightRecordsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
    this.loadProfile();
  }

  loadProfile(): void {
    this.getProfile().subscribe({
      error: (error) => {
        this.profileSubject.next(null);
        this.errorHandler.handleError(error, 'UserProfileService.loadProfile');
      }
    });
  }

  getProfile(): Observable<UserProfile> {
    console.log('UserProfileService - Getting profile from:', `${this.apiUrl}`);
    return this.http.get<any>(`${this.apiUrl}`)
      .pipe(
        map(response => {
          console.log('UserProfileService - Profile response:', response);
          const profile = new UserProfile(response.data.profile);
          this.profileSubject.next(profile);
          return profile;
        }),
        catchError(error => {
          console.error('UserProfileService - Error getting profile:', error);
          return throwError(() => this.errorHandler.handleError(error, 'UserProfileService.getProfile'));
        })
      );
  }

  updateProfile(weight_kg: number, height_cm: number, width_cm: number): Observable<UserProfile> {
    return this.http.put<any>(`${this.apiUrl}`, { weight_kg, height_cm, width_cm })
      .pipe(
        map(response => {
          const profile = new UserProfile(response.data.profile);
          this.profileSubject.next(profile);
          return profile;
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'UserProfileService.updateProfile'));
        })
      );
  }

  createProfile(weight_kg: number, height_cm: number, width_cm: number): Observable<UserProfile> {
    return this.http.post<any>(`${this.apiUrl}`, { weight_kg, height_cm, width_cm })
      .pipe(
        map(response => {
          const profile = new UserProfile(response.data.profile);
          this.profileSubject.next(profile);
          return profile;
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'UserProfileService.createProfile'));
        })
      );
  }

  getWeightHistory(params: PaginationParams): Observable<void> {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.perPage.toString())
      .set('sortOrder', params.sortOrder || 'DESC');

    return this.http.get<any>(`${this.apiUrl}/weight`, { params: httpParams })
      .pipe(
        map(response => {
          const weightHistory = response.data.weightHistory.map((w: any) => new WeightRecord(w));
          this.weightHistorySubject.next(weightHistory);
          this.totalWeightRecordsSubject.next(response.data.pagination.total);
        }),
        catchError(error => {
          this.weightHistorySubject.next([]);
          this.totalWeightRecordsSubject.next(0);
          return throwError(() => this.errorHandler.handleError(error, 'UserProfileService.getWeightHistory'));
        })
      );
  }

  recordWeight(weight_kg: number): Observable<WeightRecord> {
    return this.http.post<any>(`${this.apiUrl}/weight`, { weight_kg })
      .pipe(
        map(response => {
          this.getWeightHistory({ page: 1, perPage: 10 }).subscribe();
          return new WeightRecord(response.data.weightRecord);
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'UserProfileService.recordWeight'));
        })
      );
  }

  deleteWeightRecord(id: string): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/weight/${id}`)
      .pipe(
        map(() => {
          this.getWeightHistory({ page: 1, perPage: 10 }).subscribe();
        }),
        catchError(error => {
          return throwError(() => this.errorHandler.handleError(error, 'UserProfileService.deleteWeightRecord'));
        })
      );
  }

  calculateCalories(metValue: number, durationMinutes: number): number {
    const profile = this.profileSubject.value;
    if (!profile || !profile.weight_kg) return 0;

    // Formula: Calories = MET × Weight (kg) × Duration (hours)
    const durationHours = durationMinutes / 60;
    return Math.round(metValue * profile.weight_kg * durationHours);
  }
}
