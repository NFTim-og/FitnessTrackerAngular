import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise, WorkoutPlan, WorkoutExercise } from '../../../models/types';

@Component({
  selector: 'app-workout-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto">
      <h1 class="text-3xl font-bold mb-6">
        {{ isEditing ? 'Edit' : 'New' }} Workout Plan
      </h1>

      <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()" class="card">
        <div class="form-group">
          <label for="name" class="form-label">Plan Name</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="form-control"
            [class.border-red-500]="showError('name')"
          />
          @if (showError('name')) {
            <p class="text-red-500 text-sm mt-1">Plan name is required</p>
          }
        </div>

        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-control"
            rows="3"
            [class.border-red-500]="showError('description')"
          ></textarea>
          @if (showError('description')) {
            <p class="text-red-500 text-sm mt-1">Description is required</p>
          }
        </div>

        <div class="form-group">
          <label class="form-label">Exercises</label>
          <div class="space-y-2">
            @for (exercise of selectedExercises; track exercise.id) {
              <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span>{{ exercise.name }}</span>
                <button
                  type="button"
                  class="ml-auto text-red-500"
                  (click)="removeExercise(exercise)"
                >
                  Remove
                </button>
              </div>
            }
          </div>

          <div class="mt-2">
            <select
              (change)="addExercise($event)"
              class="form-control"
              [value]="''"
            >
              <option value="" disabled>Add an exercise</option>
              @for (exercise of availableExercises(); track exercise.id) {
                <option [value]="exercise.id">{{ exercise.name }}</option>
              }
            </select>
          </div>
        </div>

        <div class="flex gap-4 mt-6">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="workoutForm.invalid || isSubmitting"
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
export class WorkoutPlanFormComponent implements OnInit {
  workoutForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  exercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];

  constructor(
    private fb: FormBuilder,
    private workoutPlanService: WorkoutPlanService,
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.workoutForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadExercises();
    
    const workoutPlanId = this.route.snapshot.params['id'];
    if (workoutPlanId) {
      this.isEditing = true;
      this.loadWorkoutPlan(workoutPlanId);
    }
  }

  async loadExercises() {
    try {
      await this.exerciseService.loadExercises({ page: 1, perPage: 100 });
      this.exerciseService.data$.subscribe(exercises => {
        this.exercises = exercises;
      });
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  }

  async loadWorkoutPlan(id: string) {
    try {
      const workoutPlan = await this.workoutPlanService.getWorkoutPlan(id);
      if (workoutPlan) {
        this.workoutForm.patchValue({
          name: workoutPlan.name,
          description: workoutPlan.description
        });
        
        if (workoutPlan.exercises) {
          this.selectedExercises = workoutPlan.exercises
            .filter((we: WorkoutExercise) => we.exercise)
            .map((we: WorkoutExercise) => we.exercise!)
            .sort((a: Exercise, b: Exercise) => a.name.localeCompare(b.name));
        }
      }
    } catch (error) {
      console.error('Error loading workout plan:', error);
    }
  }

  availableExercises() {
    return this.exercises.filter(
      exercise => !this.selectedExercises.find(e => e.id === exercise.id)
    );
  }

  addExercise(event: Event) {
    const select = event.target as HTMLSelectElement;
    const exerciseId = select.value;
    const exercise = this.exercises.find(e => e.id === exerciseId);
    
    if (exercise) {
      this.selectedExercises = [...this.selectedExercises, exercise];
      select.value = '';
    }
  }

  removeExercise(exercise: Exercise) {
    this.selectedExercises = this.selectedExercises.filter(
      e => e.id !== exercise.id
    );
  }

  showError(field: string) {
    const control = this.workoutForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  async onSubmit() {
    if (this.workoutForm.invalid) return;

    this.isSubmitting = true;
    try {
      const exercises = this.selectedExercises.map((exercise, index) => ({
        id: exercise.id,
        order: index + 1
      }));

      if (this.isEditing) {
        const workoutPlanId = this.route.snapshot.params['id'];
        await this.workoutPlanService.updateWorkoutPlan(
          workoutPlanId,
          this.workoutForm.value,
          exercises
        );
      } else {
        await this.workoutPlanService.createWorkoutPlan(
          this.workoutForm.value,
          exercises
        );
      }
      this.router.navigate(['/workout-plans']);
    } catch (error) {
      console.error('Error saving workout plan:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/workout-plans']);
  }
}