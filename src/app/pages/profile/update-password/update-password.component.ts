import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">Update Password</h2>
      
      @if (success) {
        <div class="alert alert-success mb-4">
          Password updated successfully!
          <button class="ml-2" (click)="success = false">&times;</button>
        </div>
      }
      
      @if (error) {
        <div class="alert alert-error mb-4">
          {{ error }}
          <button class="ml-2" (click)="error = null">&times;</button>
        </div>
      }
      
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="currentPassword" class="form-label">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            formControlName="currentPassword"
            class="form-control"
            [class.border-red-500]="showError('currentPassword')"
          />
          @if (showError('currentPassword')) {
            <p class="text-red-500 text-sm mt-1">
              Current password is required
            </p>
          }
        </div>
        
        <div class="form-group">
          <label for="newPassword" class="form-label">New Password</label>
          <input
            type="password"
            id="newPassword"
            formControlName="newPassword"
            class="form-control"
            [class.border-red-500]="showError('newPassword')"
          />
          @if (showError('newPassword')) {
            <p class="text-red-500 text-sm mt-1">
              New password must be at least 8 characters and contain at least one number
            </p>
          }
        </div>
        
        <div class="form-group">
          <label for="newPasswordConfirmation" class="form-label">Confirm New Password</label>
          <input
            type="password"
            id="newPasswordConfirmation"
            formControlName="newPasswordConfirmation"
            class="form-control"
            [class.border-red-500]="showError('newPasswordConfirmation') || passwordForm.hasError('passwordMismatch')"
          />
          @if (showError('newPasswordConfirmation')) {
            <p class="text-red-500 text-sm mt-1">
              Please confirm your new password
            </p>
          }
          @if (passwordForm.hasError('passwordMismatch') && !showError('newPasswordConfirmation') && passwordForm.get('newPasswordConfirmation')?.touched) {
            <p class="text-red-500 text-sm mt-1">
              Passwords do not match
            </p>
          }
        </div>
        
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="passwordForm.invalid || isSubmitting"
        >
          {{ isSubmitting ? 'Updating...' : 'Update Password' }}
        </button>
      </form>
    </div>
  `
})
export class UpdatePasswordComponent {
  passwordForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  success = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/.*\d.*/) // At least one number
      ]],
      newPasswordConfirmation: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  // Custom validator to check if password and confirmation match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const newPasswordConfirmation = form.get('newPasswordConfirmation')?.value;
    
    if (newPassword === newPasswordConfirmation) {
      return null;
    }
    
    return { passwordMismatch: true };
  }
  
  showError(field: string) {
    const control = this.passwordForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  
  onSubmit() {
    if (this.passwordForm.invalid) return;
    
    this.isSubmitting = true;
    this.error = null;
    this.success = false;
    
    const { currentPassword, newPassword, newPasswordConfirmation } = this.passwordForm.value;
    
    this.authService.updatePassword(currentPassword, newPassword, newPasswordConfirmation)
      .subscribe({
        next: () => {
          this.success = true;
          this.passwordForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.error = error.message || 'Failed to update password';
          this.isSubmitting = false;
        }
      });
  }
}
