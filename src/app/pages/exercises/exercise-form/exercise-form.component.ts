import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">
        {{ isEditing ? 'Edit' : 'New' }} Exercise
      </h1>

      <form [formGroup]="exerciseForm" (ngSubmit)="onSubmit()" class="card">
        <div class="form-group">
          <label for="name" class="form-label">Exercise Name</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-control"
            [class.border-red-500]="showError('name')"
          />
          @if (showError('name')) {
            <p class="text-red-500 text-sm mt-1">Exercise name is required</p>
          }
        </div>

        <div class="form-group">
          <label for="duration" class="form-label">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            formControlName="duration"
            class="form-control"
            [class.border-red-500]="showError('duration')"
            (input)="updateCalories()"
          />
          @if (showError('duration')) {
            <p class="text-red-500 text-sm mt-1">
              Duration must be greater than 0
            </p>
          }
        </div>

        <div class="form-group">
          <label for="met" class="form-label">
            MET Value
            <span
              class="ml-2 text-sm text-blue-600 cursor-pointer"
              (click)="showMetInfo = !showMetInfo"
            >
              ℹ️ What's this?
            </span>
          </label>
          <input
            type="number"
            id="met"
            formControlName="met_value"
            class="form-control"
            [class.border-red-500]="showError('met_value')"
            step="0.1"
            (input)="updateCalories()"
          />
          @if (showError('met_value')) {
            <p class="text-red-500 text-sm mt-1">
              MET value must be greater than 0
            </p>
          }
        </div>

        @if (showMetInfo) {
          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 class="font-semibold mb-2">About MET Values</h3>
            <p class="mb-2">
              MET (Metabolic Equivalent of Task) represents the energy cost of physical activities.
              Common values:
            </p>
            <ul class="list-disc list-inside mb-2">
              <li>Light activity (walking slowly): 2-3 METs</li>
              <li>Moderate activity (brisk walking): 3-6 METs</li>
              <li>Vigorous activity (running): 6+ METs</li>
            </ul>
            <p>
              Your calories burned will be calculated based on your weight and the MET value.
            </p>
          </div>
        }

        <div class="form-group">
          <label class="form-label">Difficulty</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="difficulty"
                value="easy"
                class="mr-2"
              />
              Easy
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="difficulty"
                value="medium"
                class="mr-2"
              />
              Medium
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="difficulty"
                value="hard"
                class="mr-2"
              />
              Hard
            </label>
          </div>
          @if (showError('difficulty')) {
            <p class="text-red-500 text-sm mt-1">Please select a difficulty level</p>
          }
        </div>

        @if (estimatedCalories > 0) {
          <div class="bg-green-50 p-4 rounded-lg mb-4">
            <p class="font-semibold">
              Estimated Calories: {{ estimatedCalories }} kcal
            </p>
            <p class="text-sm text-gray-600">
              Based on your current weight and the exercise parameters
            </p>
          </div>
        }

        <div class="flex gap-4 mt-6">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="exerciseForm.invalid || isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            (click)="goBack()"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  exerciseForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  showMetInfo = false;
  estimatedCalories = 0;
  private profileSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exerciseForm = this.fb.group({
      name: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]],
      met_value: [4.0, [Validators.required, Validators.min(0.1)]],
      difficulty: ['', [Validators.required]]
    });

    // Subscribe to profile changes to update calories when weight changes
    this.profileSubscription = this.userProfileService.profile$.subscribe(() => {
      this.updateCalories();
    });
  }

  ngOnInit() {
    const exerciseId = this.route.snapshot.params['id'];
    if (exerciseId) {
      this.isEditing = true;
      this.loadExercise(exerciseId);
    }
    this.updateCalories();
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  async loadExercise(id: string) {
    try {
      const exercise = await this.exerciseService.getExercise(id);
      if (exercise) {
        this.exerciseForm.patchValue(exercise);
        this.updateCalories();
      }
    } catch (error) {
      console.error('Error loading exercise:', error);
    }
  }

  showError(field: string) {
    const control = this.exerciseForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  updateCalories() {
    const duration = this.exerciseForm.get('duration')?.value;
    const metValue = this.exerciseForm.get('met_value')?.value;
    
    if (duration && metValue) {
      this.estimatedCalories = this.userProfileService.calculateCalories(metValue, duration);
    } else {
      this.estimatedCalories = 0;
    }
  }

  async onSubmit() {
    if (this.exerciseForm.invalid) return;

    this.isSubmitting = true;
    try {
      const formData = {
        ...this.exerciseForm.value,
        calories: this.estimatedCalories
      };

      if (this.isEditing) {
        const exerciseId = this.route.snapshot.params['id'];
        await this.exerciseService.updateExercise(exerciseId, formData);
      } else {
        await this.exerciseService.createExercise(formData);
      }
      this.router.navigate(['/exercises']);
    } catch (error) {
      console.error('Error saving exercise:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/exercises']);
  }
}