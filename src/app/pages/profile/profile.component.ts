import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppError } from '../../shared/models/error.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../services/auth.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UpdatePasswordComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile$ = this.userProfileService.profile$;
  isAdmin$ = this.authService.user$.pipe(map(user => user?.role === 'admin'));
  profileForm: FormGroup;
  isSubmitting = false;
  weightHistory: any[] = [];
  error: string | null = null;
  successMessage: string | null = null;
  userEmail = '';
  selectedRole: 'admin' | 'user' = 'user';
  currentUser$ = this.authService.user$;
  roleUpdateMessage = '';
  roleUpdateError = false;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    public authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      width: ['', [Validators.required, Validators.min(30), Validators.max(300)]]
    });
  }

  ngOnInit() {
    console.log('ProfileComponent - Initializing');
    this.loadWeightHistory();

    // Subscribe to profile changes and update form accordingly
    this.profile$.subscribe(profile => {
      console.log('ProfileComponent - Profile loaded:', profile);
      if (profile) {
        // Check for weight and height in both formats (snake_case and camelCase)
        const weight = profile.weight_kg;
        const height = profile.height_cm;
        const width = profile.width_cm;

        console.log('ProfileComponent - Extracted weight/height/width:', { weight, height, width });

        if (weight && height) {
          // Only update form if we have valid weight and height data
          const formValues = {
            weight: weight,
            height: height,
            width: width
          };

          console.log('ProfileComponent - Updating form with profile data:', formValues);

          this.profileForm.patchValue(formValues, { emitEvent: false }); // Don't emit events to avoid infinite loops
        }
      }
    });

    // Check if user is authenticated
    this.authService.user$.subscribe(user => {
      console.log('ProfileComponent - Current user:', user);
    });
  }

  async loadWeightHistory() {
    console.log('ProfileComponent - Loading weight history');
    try {
      // Simplified for now - we'll implement this later
      this.weightHistory = [];
      this.error = null;
      console.log('ProfileComponent - Weight history loaded successfully');
    } catch (error) {
      console.error('ProfileComponent - Error loading weight history:', error);
      this.error = error instanceof AppError ? error.message : 'Failed to load weight history';
    }
  }

  async updateUserRole() {
    try {
      this.roleUpdateMessage = '';
      this.roleUpdateError = false;

      // Simplified for now - we'll implement this later
      this.roleUpdateMessage = `Role update functionality will be implemented later`;
      this.error = null;
      this.userEmail = '';
      this.selectedRole = 'user';
    } catch (error: any) {
      const message = error instanceof AppError ? error.message : 'Failed to update user role';
      this.roleUpdateMessage = message;
      this.roleUpdateError = true;
    }
  }

  showError(field: string) {
    const control = this.profileForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    try {
      const profile = await firstValueFrom(this.userProfileService.profile$);
      const { weight, height, width } = this.profileForm.value;

      console.log('ProfileComponent - Submitting form with values:', { weight, height, width });

      let updatedProfile;
      if (profile) {
        updatedProfile = await firstValueFrom(this.userProfileService.updateProfile(weight, height, width));
      } else {
        updatedProfile = await firstValueFrom(this.userProfileService.createProfile(weight, height, width));
      }

      console.log('ProfileComponent - Received updated profile:', updatedProfile);

      // Update the form with the saved values to ensure they persist
      const formValues = {
        weight: updatedProfile.weight_kg,
        height: updatedProfile.height_cm,
        width: updatedProfile.width_cm
      };

      console.log('ProfileComponent - Updating form with values:', formValues);

      this.profileForm.patchValue(formValues, { emitEvent: false });

      // Mark form as pristine to show it's saved
      this.profileForm.markAsPristine();

      this.error = null;
      this.successMessage = 'Profile updated successfully!';

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);

      await this.loadWeightHistory();

      console.log('ProfileComponent - Form updated successfully, current values:', this.profileForm.value);
    } catch (error) {
      console.error('ProfileComponent - Error saving profile:', error);
      this.error = error instanceof AppError ? error.message : 'Failed to save profile';
    } finally {
      this.isSubmitting = false;
    }
  }
}