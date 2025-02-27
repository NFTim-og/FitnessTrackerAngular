import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
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