import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center">
      <div class="max-w-md w-full">
        <h1 class="text-3xl font-bold text-center mb-8">Create Account</h1>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="card">
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
              <p class="text-red-500 text-sm mt-1">
                Password must be at least 6 characters
              </p>
            }
          </div>

          @if (error) {
            <div class="text-red-500 text-sm mb-4">{{ error }}</div>
          }

          <button
            type="submit"
            class="btn btn-primary w-full"
            [disabled]="registerForm.invalid || isLoading"
          >
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  showError(field: string) {
    const control = this.registerForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    try {
      await this.supabaseService.signUp(
        this.registerForm.value.email,
        this.registerForm.value.password
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      this.error = error.message || 'An error occurred during registration';
    } finally {
      this.isLoading = false;
    }
  }
}