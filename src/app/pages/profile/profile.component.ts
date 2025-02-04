import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { SupabaseService } from '../../services/supabase.service';
import { UserProfile, WeightHistory } from '../../models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">Profile Settings</h1>

      @if (currentUser$ | async; as user) {
        <div class="card mb-6">
          <h2 class="text-xl font-semibold mb-2">Account Information</h2>
          <p class="text-sm text-gray-600">User ID: {{ user.id }}</p>
          <p class="text-sm text-gray-600">Email: {{ user.email }}</p>
        </div>
      }

      @if (profile$ | async; as profile) {
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="card">
          <div class="form-group">
            <label for="weight" class="form-label">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              formControlName="weight"
              class="form-control"
              [class.border-red-500]="showError('weight')"
              step="0.1"
            />
            @if (showError('weight')) {
              <p class="text-red-500 text-sm mt-1">
                Please enter a valid weight greater than 0
              </p>
            }
          </div>

          <div class="form-group">
            <label for="height" class="form-label">Height (cm)</label>
            <input
              type="number"
              id="height"
              formControlName="height"
              class="form-control"
              [class.border-red-500]="showError('height')"
              step="0.1"
            />
            @if (showError('height')) {
              <p class="text-red-500 text-sm mt-1">
                Please enter a valid height greater than 0
              </p>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="profileForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>

        @if (weightHistory.length > 0) {
          <div class="card mt-6">
            <h2 class="text-xl font-semibold mb-4">Weight History</h2>
            <div class="space-y-2">
              @for (entry of weightHistory; track entry.id) {
                <div class="flex justify-between items-center">
                  <span>{{ entry.weight_kg }} kg</span>
                  <span class="text-sm text-gray-600">
                    {{ entry.recorded_at | date:'medium' }}
                  </span>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="card">
          <h2 class="text-xl font-semibold mb-4">Complete Your Profile</h2>
          <p class="mb-4">
            Please enter your weight and height to enable personalized calorie calculations.
          </p>

          <div class="form-group">
            <label for="weight" class="form-label">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              formControlName="weight"
              class="form-control"
              [class.border-red-500]="showError('weight')"
              step="0.1"
            />
            @if (showError('weight')) {
              <p class="text-red-500 text-sm mt-1">
                Please enter a valid weight greater than 0
              </p>
            }
          </div>

          <div class="form-group">
            <label for="height" class="form-label">Height (cm)</label>
            <input
              type="number"
              id="height"
              formControlName="height"
              class="form-control"
              [class.border-red-500]="showError('height')"
              step="0.1"
            />
            @if (showError('height')) {
              <p class="text-red-500 text-sm mt-1">
                Please enter a valid height greater than 0
              </p>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="profileForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Creating Profile...' : 'Create Profile' }}
          </button>
        </form>
      }

      @if (isAdmin$ | async) {
        <div class="card mt-6">
          <h2 class="text-xl font-semibold mb-4">Admin Controls</h2>
          <p class="mb-4">You have administrative privileges.</p>
          
          <div class="form-group">
            <label for="userEmail" class="form-label">User Email</label>
            <input
              type="email"
              id="userEmail"
              [(ngModel)]="userEmail"
              class="form-control"
              [ngModelOptions]="{standalone: true}"
            />
          </div>
          
          <div class="form-group">
            <label for="userRole" class="form-label">Role</label>
            <select
              id="userRole"
              [(ngModel)]="selectedRole"
              class="form-control"
              [ngModelOptions]="{standalone: true}"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            (click)="updateUserRole()"
            class="btn btn-primary"
            [disabled]="!userEmail"
          >
            Update User Role
          </button>

          @if (roleUpdateMessage) {
            <p class="mt-4" [class.text-green-500]="!roleUpdateError" [class.text-red-500]="roleUpdateError">
              {{ roleUpdateMessage }}
            </p>
          }
        </div>
      }

      <div class="card mt-6">
        <h2 class="text-xl font-semibold mb-4">About MET Values</h2>
        <p class="mb-4">
          MET (Metabolic Equivalent of Task) is a measure of energy used by the body during
          an activity. A MET of 1 represents resting energy expenditure, while higher MET
          values indicate more intense exercises.
        </p>
        <h3 class="font-semibold mb-2">Common MET Values:</h3>
        <ul class="list-disc list-inside space-y-1">
          <li>Walking (3.5 mph) - MET 3.5</li>
          <li>Cycling (12-14 mph) - MET 8.0</li>
          <li>Running (6 mph) - MET 10.0</li>
          <li>Swimming laps - MET 6.0</li>
          <li>Weight training - MET 3.5</li>
        </ul>
        <p class="mt-4">
          Your calories burned are calculated using the formula:
          <br>
          <code class="bg-gray-100 px-2 py-1 rounded">
            Calories = MET × Weight (kg) × Duration (hours)
          </code>
        </p>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile$ = this.userProfileService.profile$;
  isAdmin$ = this.supabaseService.user$.pipe(map(user => user?.role === 'admin'));
  profileForm: FormGroup;
  isSubmitting = false;
  weightHistory: WeightHistory[] = [];
  userEmail = '';
  selectedRole: 'admin' | 'user' = 'user';
  currentUser$ = this.supabaseService.user$;
  roleUpdateMessage = '';
  roleUpdateError = false;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    public supabaseService: SupabaseService
  ) {
    this.profileForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(0.1)]],
      height: ['', [Validators.required, Validators.min(0.1)]]
    });
  }

  ngOnInit() {
    this.loadWeightHistory();
    this.profile$.subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue({
          weight: profile.weight_kg,
          height: profile.height_cm
        });
      }
    });
  }

  async loadWeightHistory() {
    try {
      this.weightHistory = await this.userProfileService.getWeightHistory();
    } catch (error) {
      console.error('Error loading weight history:', error);
    }
  }

  async updateUserRole() {
    try {
      this.roleUpdateMessage = '';
      this.roleUpdateError = false;

      // First, get the user ID from the email
      const { data: users, error: userError } = await this.supabaseService.client
        .from('auth.users')
        .select('id')
        .eq('email', this.userEmail)
        .single();

      if (userError) throw new Error('User not found');

      await this.supabaseService.setUserRole(users.id, this.selectedRole);
      this.roleUpdateMessage = `Successfully updated role for ${this.userEmail}`;
      this.userEmail = '';
      this.selectedRole = 'user';
    } catch (error: any) {
      console.error('Error updating user role:', error);
      this.roleUpdateMessage = error.message || 'Error updating user role';
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
      const { weight, height } = this.profileForm.value;

      if (profile) {
        await this.userProfileService.updateProfile(weight, height);
      } else {
        await this.userProfileService.createProfile(weight, height);
      }

      await this.loadWeightHistory();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}