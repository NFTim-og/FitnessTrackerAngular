import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../models/types';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">{{ isEditing ? 'Edit' : 'New' }} Exercise</h1>

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
          />
          @if (showError('duration')) {
            <p class="text-red-500 text-sm mt-1">
              Duration must be greater than 0
            </p>
          }
        </div>

        <div class="form-group">
          <label for="calories" class="form-label">Calories Burned</label>
          <input
            type="number"
            id="calories"
            formControlName="calories"
            class="form-control"
            [class.border-red-500]="showError('calories')"
          />
          @if (showError('calories')) {
            <p class="text-red-500 text-sm mt-1">
              Calories must be 0 or greater
            </p>
          }
        </div>

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
  `,
  styles: [`
    .btn-secondary {
      background-color: #9ca3af;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #6b7280;
    }
  `]
})
export class ExerciseFormComponent implements OnInit {
  exerciseForm: FormGroup;
  isEditing = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exerciseForm = this.fb.group({
      name: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]],
      calories: ['', [Validators.required, Validators.min(0)]],
      difficulty: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const exerciseId = this.route.snapshot.params['id'];
    if (exerciseId) {
      this.isEditing = true;
      this.loadExercise(exerciseId);
    }
  }

  async loadExercise(id: string) {
    try {
      const exercise = await this.exerciseService.getExercise(id);
      if (exercise) {
        this.exerciseForm.patchValue(exercise);
      }
    } catch (error) {
      console.error('Error loading exercise:', error);
      // TODO: Add error handling
    }
  }

  showError(field: string) {
    const control = this.exerciseForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  async onSubmit() {
    if (this.exerciseForm.invalid) return;

    this.isSubmitting = true;
    try {
      if (this.isEditing) {
        const exerciseId = this.route.snapshot.params['id'];
        await this.exerciseService.updateExercise(
          exerciseId,
          this.exerciseForm.value
        );
      } else {
        await this.exerciseService.createExercise(this.exerciseForm.value);
      }
      this.router.navigate(['/exercises']);
    } catch (error) {
      console.error('Error saving exercise:', error);
      // TODO: Add error handling
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/exercises']);
  }
}