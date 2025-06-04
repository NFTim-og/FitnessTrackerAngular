/**
 * Auth Service Tests
 * Tests for the Authentication service's API interactions
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { TokenService } from '../shared/services/token.service';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { AppError } from '../shared/models/error.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    // Create spies for dependencies
    const errorHandlerSpyObj = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);
    const tokenServiceSpyObj = jasmine.createSpyObj('TokenService', [
      'getToken', 'setToken', 'removeToken', 'hasToken'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ErrorHandlerService, useValue: errorHandlerSpyObj },
        { provide: TokenService, useValue: tokenServiceSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;

    // Setup default token service behavior
    tokenServiceSpy.getToken.and.returnValue(null);
    tokenServiceSpy.hasToken.and.returnValue(false);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user', () => {
      // Mock data
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      };
      const mockResponse = {
        status: 'success',
        token: 'mock-token',
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'user'
          }
        }
      };

      // Call the service method
      service.register(userData.email, userData.password, userData.passwordConfirm).subscribe(result => {
        expect(result.token).toBe('mock-token');
        expect(result.user).toBeInstanceOf(User);
        expect(result.user.email).toBe('test@example.com');
      });

      // Expect a POST request to the correct URL
      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);

      // Respond with mock data
      req.flush(mockResponse);

      // Verify that token was stored via TokenService
      expect(tokenServiceSpy.setToken).toHaveBeenCalledWith('mock-token');
    });

    it('should handle registration errors', () => {
      // Setup error handler spy
      errorHandlerSpy.handleError.and.returnValue(new AppError('Email already in use'));

      // Call the service method
      service.register('test@example.com', 'password123', 'password123').subscribe({
        error: (error) => {
          expect(error instanceof AppError).toBeTrue();
          expect(error.message).toBe('Email already in use');
        }
      });

      // Expect a POST request to the correct URL
      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');

      // Respond with an error
      req.error(new ErrorEvent('Network error'));

      // Verify that the error handler was called
      expect(errorHandlerSpy.handleError).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should log in a user', () => {
      // Mock data
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      const mockResponse = {
        status: 'success',
        token: 'mock-token',
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'user'
          }
        }
      };

      // Call the service method
      service.login(loginData.email, loginData.password).subscribe(result => {
        expect(result.token).toBe('mock-token');
        expect(result.user).toBeInstanceOf(User);
        expect(result.user.email).toBe('test@example.com');
      });

      // Expect a POST request to the correct URL
      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);

      // Respond with mock data
      req.flush(mockResponse);

      // Verify that token was stored via TokenService
      expect(tokenServiceSpy.setToken).toHaveBeenCalledWith('mock-token');
    });
  });

  describe('logout', () => {
    it('should log out a user', () => {
      // Setup: Set a user
      service['userSubject'].next(new User({ id: '1', email: 'test@example.com' }));

      // Call the service method
      service.logout();

      // Verify that token was removed via TokenService
      expect(tokenServiceSpy.removeToken).toHaveBeenCalled();

      // Verify that user was cleared
      service.user$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  describe('getMe', () => {
    it('should get the current user profile', () => {
      // Mock data
      const mockResponse = {
        status: 'success',
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'user'
          }
        }
      };

      // Call the service method
      service.getMe().subscribe(user => {
        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe('1');
        expect(user.email).toBe('test@example.com');
      });

      // Expect a GET request to the correct URL
      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');

      // Respond with mock data
      req.flush(mockResponse);
    });

    it('should log out if getting profile fails', () => {
      // Setup error handler spy
      errorHandlerSpy.handleError.and.returnValue(new AppError('Unauthorized'));

      // Call the service method
      service.getMe().subscribe({
        error: (error) => {
          expect(error instanceof AppError).toBeTrue();
          expect(error.message).toBe('Unauthorized');
        }
      });

      // Expect a GET request to the correct URL
      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');

      // Respond with an error
      req.error(new ErrorEvent('Network error'));

      // Verify that token was removed via TokenService
      expect(tokenServiceSpy.removeToken).toHaveBeenCalled();
    });
  });

  describe('helper methods', () => {
    it('should return the current user', () => {
      const user = new User({ id: '1', email: 'test@example.com' });
      service['userSubject'].next(user);
      expect(service.currentUser).toBe(user);
    });

    it('should return the token', () => {
      tokenServiceSpy.getToken.and.returnValue('mock-token');
      expect(service.token).toBe('mock-token');
    });

    it('should check if user is logged in', () => {
      tokenServiceSpy.hasToken.and.returnValue(false);
      expect(service.isLoggedIn).toBeFalse();

      tokenServiceSpy.hasToken.and.returnValue(true);
      expect(service.isLoggedIn).toBeTrue();
    });

    it('should check if user is admin', () => {
      expect(service.isAdmin()).toBeFalse();

      // Set regular user
      service['userSubject'].next(new User({ id: '1', email: 'user@example.com', role: 'user' }));
      expect(service.isAdmin()).toBeFalse();

      // Set admin user
      service['userSubject'].next(new User({ id: '2', email: 'admin@example.com', role: 'admin' }));
      expect(service.isAdmin()).toBeTrue();
    });
  });
});
