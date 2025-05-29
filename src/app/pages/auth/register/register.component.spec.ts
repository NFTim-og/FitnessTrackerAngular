import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
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
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      email: '',
      password: '',
      passwordConfirmation: ''
    });
  });

  it('should validate required fields', () => {
    expect(component.registerForm.valid).toBeFalse();

    component.registerForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    });

    expect(component.registerForm.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate password length', () => {
    const passwordControl = component.registerForm.get('password');

    passwordControl?.setValue('short');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should register user and navigate on successful submit', () => {
    // Setup mock response
    authService.register.and.returnValue(of(mockAuthResponse));
    spyOn(router, 'navigate');

    // Fill the form
    component.registerForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    });

    // Submit the form
    component.onSubmit();

    // Verify service was called with correct parameters
    expect(authService.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'password123'
    );

    // Verify navigation occurred
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration error', () => {
    // Setup error response
    const errorMessage = 'Email already exists';
    authService.register.and.returnValue(throwError(() => ({ message: errorMessage })));

    // Fill the form
    component.registerForm.patchValue({
      email: 'existing@example.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    });

    // Submit the form
    component.onSubmit();

    // Verify error is displayed
    expect(component.error).toBe(errorMessage);
  });
});