import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center">
      <div class="max-w-md w-full">
        <h1 class="text-3xl font-bold text-center mb-8">Sign In</h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="card">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.border-red-500]="showError('email')"
            />
            @if (showError('email')) {
              <p class="text-red-500 text-sm mt-1">Please enter a valid email</p>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.border-red-500]="showError('password')"
            />
            @if (showError('password')) {
              <p class="text-red-500 text-sm mt-1">Password is required</p>
            }
          </div>

          @if (error) {
            <div class="text-red-500 text-sm mb-4">{{ error }}</div>
          }

          <button
            type="submit"
            class="btn btn-primary w-full"
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  showError(field: string) {
    const control = this.loginForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    try {
      await this.supabaseService.signIn(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      this.error = error.message || 'An error occurred during sign in';
    } finally {
      this.isLoading = false;
    }
  }
}