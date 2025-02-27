import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
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