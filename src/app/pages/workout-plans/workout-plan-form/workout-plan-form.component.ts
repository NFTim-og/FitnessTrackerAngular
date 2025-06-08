import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise, WorkoutPlan, WorkoutExercise } from '../../../models/types';
import { PaginationState } from '../../../shared/interfaces/pagination.interface';
import { Subscription } from 'rxjs';
import { AppError } from '../../../shared/models/error.model';
import { MaterialButtonComponent } from '../../../shared/components/material-button/material-button.component';

@Component({
  selector: 'app-workout-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MaterialButtonComponent
  ],
  templateUrl: './workout-plan-form.component.html',
  styleUrls: ['./workout-plan-form.component.css']
})
export class WorkoutPlanFormComponent implements OnInit, OnDestroy {
  workoutForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  exercises: Exercise[] = [];
  selectedExercises: Exercise[] = [];
  error: string | null = null;
  private subscriptions: Subscription[] = [];

  pagination: PaginationState = {
    currentPage: 1,
    totalCount: 0,
    perPage: 6
  };

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

    // Subscribe to total count changes
    this.subscriptions.push(
      this.exerciseService.totalCount$.subscribe(count => {
        this.pagination = { ...this.pagination, totalCount: count };
      })
    );
  }

  ngOnInit() {
    // Subscribe to exercise data changes
    this.subscriptions.push(
      this.exerciseService.data$.subscribe(
        exercises => this.exercises = exercises
      )
    );

    this.loadExercises();

    const workoutPlanId = this.route.snapshot.params['id'];
    if (workoutPlanId) {
      this.isEditing = true;
      this.loadWorkoutPlan(workoutPlanId);
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadExercises() {
    try {
      this.exerciseService.loadExercises({
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      }).subscribe(() => {
        this.error = null;
      }, error => {
        this.error = error instanceof AppError ? error.message : 'Failed to load exercises';
      });
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to load exercises';
    }
  }

  changePage(page: number) {
    this.pagination.currentPage = page;
    this.loadExercises();
  }

  loadWorkoutPlan(id: string) {
    try {
      this.workoutPlanService.getWorkoutPlan(id).subscribe(workoutPlan => {
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
      }, error => {
        this.error = error instanceof Error ? error.message : 'Failed to load workout plan';
      });
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load workout plan';
    }
  }

  availableExercises() {
    return this.exercises.filter(
      exercise => !this.selectedExercises.find(e => e.id === exercise.id)
    );
  }

  addExercise(event: MatSelectChange) {
    const exerciseId = event.value;
    const exercise = this.exercises.find(e => e.id === exerciseId);

    if (exercise) {
      this.selectedExercises = [...this.selectedExercises, exercise];
      // Reset the select value
      event.source.value = '';
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

  onSubmit() {
    if (this.workoutForm.invalid) return;

    this.isSubmitting = true;
    try {
      const exercises = this.selectedExercises.map((exercise, index) => ({
        exercise_id: exercise.id,
        order: index + 1
      }));

      if (this.isEditing) {
        const workoutPlanId = this.route.snapshot.params['id'];
        this.workoutPlanService.updateWorkoutPlan(
          workoutPlanId,
          this.workoutForm.value,
          exercises
        ).subscribe(() => {
          this.router.navigate(['/workout-plans']);
        }, error => {
          console.error('Error updating workout plan:', error);
          this.isSubmitting = false;
        });
      } else {
        this.workoutPlanService.createWorkoutPlan(
          this.workoutForm.value,
          exercises
        ).subscribe(() => {
          this.router.navigate(['/workout-plans']);
        }, error => {
          console.error('Error creating workout plan:', error);
          this.isSubmitting = false;
        });
      }
    } catch (error) {
      console.error('Error saving workout plan:', error);
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/workout-plans']);
  }
}