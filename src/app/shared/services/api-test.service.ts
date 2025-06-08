import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Test the API health endpoint
   */
  testHealth(): Observable<boolean> {
    // Health endpoint is at /health, not /api/v1/health
    const healthUrl = `${environment.apiUrl.replace('/api/v1', '')}/health`;
    console.log('Testing health endpoint:', healthUrl);
    return this.http.get<any>(healthUrl)
      .pipe(
        map(response => {
          console.log('API Health Response:', response);
          return response.status === 'success';
        }),
        catchError(error => {
          console.error('API Health Error:', error);
          return of(false);
        })
      );
  }

  /**
   * Test user registration
   */
  testRegistration(): Observable<boolean> {
    // Password must meet complexity requirements: uppercase, lowercase, number, special character
    const password = 'TestPass123!';
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: password,
      passwordConfirm: password,
      firstName: 'Test',
      lastName: 'User'
    };

    console.log('Testing registration with user:', { ...testUser, password: '[HIDDEN]', passwordConfirm: '[HIDDEN]' });

    return this.http.post<any>(`${this.apiUrl}/auth/register`, testUser)
      .pipe(
        map(response => {
          console.log('API Registration Response:', response);
          return response.status === 'success' && !!response.token;
        }),
        catchError(error => {
          console.error('API Registration Error:', error);
          return of(false);
        })
      );
  }

  /**
   * Run all API tests
   */
  runAllTests(): Observable<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};

    return this.testHealth().pipe(
      tap(result => results['health'] = result),
      tap(() => console.log('Health test result:', results['health'])),

      // Chain the registration test
      tap(() => {
        if (results['health']) {
          this.testRegistration().subscribe(result => {
            results['registration'] = result;
            console.log('Registration test result:', results['registration']);
          });
        }
      }),

      // Return all results
      map(() => results)
    );
  }
}
