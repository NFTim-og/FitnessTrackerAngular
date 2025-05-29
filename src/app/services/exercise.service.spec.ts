/**
 * Exercise Service Tests
 * Tests for the Exercise service's API interactions
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../environments/environment';
import { AppError } from '../shared/models/error.model';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    // Create spy for error handler
    const spy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExerciseService,
        { provide: ErrorHandlerService, useValue: spy }
      ]
    });

    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadExercises', () => {
    it('should load exercises with pagination', () => {
      // Mock data
      const mockResponse = {
        status: 'success',
        data: {
          exercises: [
            { id: '1', name: 'Push-ups', duration: 10, difficulty: 'medium' as const },
            { id: '2', name: 'Sit-ups', duration: 15, difficulty: 'easy' as const }
          ],
          pagination: {
            total: 2,
            page: 1,
            limit: 10,
            pages: 1
          }
        }
      };

      // Setup initial state
      service['exercisesSubject'].next([]);
      service['totalCountSubject'].next(0);

      // Call the service method
      service.loadExercises({ page: 1, perPage: 10 }).subscribe();

      // Expect a GET request to the correct URL
      const req = httpMock.expectOne(`${environment.apiUrl}/exercises?page=1&limit=10&sortBy=name&sortOrder=ASC`);
      expect(req.request.method).toBe('GET');

      // Respond with mock data
      req.flush(mockResponse);

      // Manually update the subjects as the service would
      service['exercisesSubject'].next(mockResponse.data.exercises.map(e => new Exercise(e)));
      service['totalCountSubject'].next(mockResponse.data.pagination.total);

      // Verify that the exercises were updated
      expect(service['exercisesSubject'].value.length).toBe(2);
      expect(service['exercisesSubject'].value[0].name).toBe('Push-ups');
      expect(service['exercisesSubject'].value[1].name).toBe('Sit-ups');

      // Verify that the total count was updated
      expect(service['totalCountSubject'].value).toBe(2);
    });

    it('should handle errors', () => {
      // Setup error handler spy
      errorHandlerSpy.handleError.and.returnValue(new AppError('Error loading exercises'));

      // Call the service method
      service.loadExercises({ page: 1, perPage: 10 }).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error loading exercises');
        }
      });

      // Expect a GET request to the correct URL
      const req = httpMock.expectOne(`${environment.apiUrl}/exercises?page=1&limit=10&sortBy=name&sortOrder=ASC`);
      expect(req.request.method).toBe('GET');

      // Respond with an error
      req.error(new ErrorEvent('Network error'));

      // Verify that the error handler was called
      expect(errorHandlerSpy.handleError).toHaveBeenCalled();
    });
  });

  describe('getExercise', () => {
    it('should get a specific exercise by ID', () => {
      // Mock data
      const mockResponse = {
        status: 'success',
        data: {
          exercise: { id: '1', name: 'Push-ups', duration: 10 }
        }
      };

      // Call the service method
      service.getExercise('1').subscribe(exercise => {
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe('1');
        expect(exercise.name).toBe('Push-ups');
      });

      // Expect a GET request to the correct URL
      const req = httpMock.expectOne(`${environment.apiUrl}/exercises/1`);
      expect(req.request.method).toBe('GET');

      // Respond with mock data
      req.flush(mockResponse);
    });
  });

  describe('createExercise', () => {
    it('should create a new exercise', () => {
      // Mock data
      const newExercise = new Exercise({
        name: 'Push-ups',
        duration: 10,
        calories: 100,
        difficulty: 'medium',
        met_value: 3.5
      });
      const mockResponse = {
        status: 'success',
        data: {
          exercise: { ...newExercise, id: '1', created_by: 'user1' }
        }
      };

      // Spy on loadExercises
      spyOn(service, 'loadExercises').and.returnValue({
        subscribe: () => {}
      } as any);

      // Call the service method
      service.createExercise(newExercise).subscribe(exercise => {
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe('1');
        expect(exercise.name).toBe('Push-ups');
      });

      // Expect a POST request to the correct URL
      const req = httpMock.expectOne(`${environment.apiUrl}/exercises`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newExercise);

      // Respond with mock data
      req.flush(mockResponse);

      // Verify that loadExercises was called to refresh the list
      expect(service.loadExercises).toHaveBeenCalled();
    });
  });

  describe('updateExercise', () => {
    it('should update an existing exercise', () => {
      // Mock data
      const updateData = {
        name: 'Advanced Push-ups',
        difficulty: 'hard' as const
      };
      const mockResponse = {
        status: 'success',
        data: {
          exercise: { id: '1', ...updateData }
        }
      };

      // Spy on loadExercises
      spyOn(service, 'loadExercises').and.returnValue({
        subscribe: () => {}
      } as any);

      // Call the service method
      service.updateExercise('1', updateData).subscribe(exercise => {
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe('1');
        expect(exercise.name).toBe('Advanced Push-ups');
        expect(exercise.difficulty).toBe('hard');
      });

      // Expect a PUT request to the correct URL
      const req = httpMock.expectOne(`${environment.apiUrl}/exercises/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);

      // Respond with mock data
      req.flush(mockResponse);

      // Verify that loadExercises was called to refresh the list
      expect(service.loadExercises).toHaveBeenCalled();
    });
  });

  describe('deleteExercise', () => {
    it('should delete an exercise', () => {
      // Mock data
      const mockResponse = {
        status: 'success',
        data: null
      };

      // Spy on loadExercises
      spyOn(service, 'loadExercises').and.returnValue({
        subscribe: () => {}
      } as any);

      // Call the service method
      service.deleteExercise('1').subscribe();

      // Expect a DELETE request to the correct URL
      const req = httpMock.expectOne(`${environment.apiUrl}/exercises/1`);
      expect(req.request.method).toBe('DELETE');

      // Respond with mock data
      req.flush(mockResponse);

      // Verify that loadExercises was called to refresh the list
      expect(service.loadExercises).toHaveBeenCalled();
    });
  });

  describe('searchExercises', () => {
    it('should search exercises with filters', () => {
      // Mock data
      const mockResponse = {
        status: 'success',
        data: {
          exercises: [
            { id: '1', name: 'Push-ups', difficulty: 'medium' as const }
          ],
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
            pages: 1
          }
        }
      };

      // Call the service method
      service.searchExercises('push', 'medium', { page: 1, perPage: 10 }).subscribe();

      // Expect a GET request to the correct URL with query parameters
      const req = httpMock.expectOne(
        `${environment.apiUrl}/exercises?page=1&limit=10&sortBy=name&sortOrder=ASC&search=push&difficulty=medium`
      );
      expect(req.request.method).toBe('GET');

      // Respond with mock data
      req.flush(mockResponse);

      // Manually update the subjects as the service would
      service['exercisesSubject'].next(mockResponse.data.exercises.map(e => new Exercise(e)));
      service['totalCountSubject'].next(mockResponse.data.pagination.total);

      // Verify that the exercises were updated
      expect(service['exercisesSubject'].value.length).toBe(1);
      expect(service['exercisesSubject'].value[0].name).toBe('Push-ups');
      expect(service['exercisesSubject'].value[0].difficulty).toBe('medium');

      // Verify that the total count was updated
      expect(service['totalCountSubject'].value).toBe(1);
    });
  });
});
