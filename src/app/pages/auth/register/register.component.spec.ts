import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { SupabaseService } from '../../../services/supabase.service';
import { User, Session } from '@supabase/supabase-js';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let supabaseService: jasmine.SpyObj<SupabaseService>;
  let router: Router;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString()
  };

  const mockSession: Session = {
    access_token: 'token',
    refresh_token: 'refresh',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser
  };

  const mockAuthResponse = {
    data: {
      user: mockUser,
      session: mockSession
    },
    error: null
  };

  beforeEach(async () => {
    const supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', ['signUp']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: SupabaseService, useValue: supabaseServiceSpy }
      ]
    }).compileComponents();

    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
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
      password: ''
    });
  });

  it('should validate required fields', () => {
    expect(component.registerForm.valid).toBeFalse();
    
    component.registerForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
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

  it('should register user and navigate on successful submit', async () => {
    supabaseService.signUp.and.returnValue(Promise.resolve(mockAuthResponse.data));
    spyOn(router, 'navigate');

    component.registerForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    await component.onSubmit();

    expect(supabaseService.signUp).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration error', async () => {
    const errorMessage = 'Email already exists';
    supabaseService.signUp.and.returnValue(Promise.reject(new Error(errorMessage)));

    component.registerForm.patchValue({
      email: 'existing@example.com',
      password: 'password123'
    });

    await component.onSubmit();

    expect(component.error).toBe(errorMessage);
  });
});