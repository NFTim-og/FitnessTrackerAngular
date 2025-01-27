import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { SupabaseService } from '../../../services/supabase.service';
import { User } from '@supabase/supabase-js';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let supabaseService: jasmine.SpyObj<SupabaseService>;
  let router: Router;

  const mockAuthResponse = {
    data: {
      user: { id: '1', email: 'test@example.com' } as User,
      session: {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600
      }
    },
    error: null
  };

  beforeEach(async () => {
    const supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', ['signIn']);

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

  it('should sign in user and navigate on successful submit', async () => {
    supabaseService.signIn.and.returnValue(Promise.resolve(mockAuthResponse.data));
    spyOn(router, 'navigate');

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    await component.onSubmit();

    expect(supabaseService.signIn).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle sign in error', async () => {
    const errorMessage = 'Invalid credentials';
    supabaseService.signIn.and.returnValue(Promise.reject(new Error(errorMessage)));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrong-password'
    });

    await component.onSubmit();

    expect(component.error).toBe(errorMessage);
  });
});