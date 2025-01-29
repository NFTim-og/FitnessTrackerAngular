import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile, WeightHistory } from '../../models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">Profile Settings</h1>

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
  profileForm: FormGroup;
  isSubmitting = false;
  weightHistory: WeightHistory[] = [];

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService
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