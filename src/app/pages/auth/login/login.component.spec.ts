import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  // Mock user data
  const mockUser = new User({
    id: '1',
    email: 'test@example.com',
    role: 'user'
  });

  // Mock authentication response
  const mockAuthResponse = {
    token: 'mock-token',
    user: mockUser
  };

  beforeEach(async () => {
    // Create spy for AuthService
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: ''
    });
  });

  it('should validate required fields', () => {
    expect(component.loginForm.valid).toBeFalse();

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(component.loginForm.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should log in user and navigate on successful submit', () => {
    // Setup mock response
    authService.login.and.returnValue(of(mockAuthResponse));
    spyOn(router, 'navigate');

    // Fill the form
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Submit the form
    component.onSubmit();

    // Verify service was called with correct parameters
    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );

    // Verify navigation occurred
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    // Setup error response
    const errorMessage = 'Invalid credentials';
    authService.login.and.returnValue(throwError(() => ({ message: errorMessage })));

    // Fill the form
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrong-password'
    });

    // Submit the form
    component.onSubmit();

    // Verify error is displayed
    expect(component.error).toBe(errorMessage);
  });
});