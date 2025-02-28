import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise, WorkoutPlan, WorkoutExercise } from '../../../models/types';
import { PaginationState } from '../../../shared/interfaces/pagination.interface';
import { Subscription } from 'rxjs';
import { AppError } from '../../../shared/models/error.model';

@Component({
  selector: 'app-workout-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workout-plan-form.component.html'
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

  async loadExercises() {
    try {
      await this.exerciseService.loadExercises({
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      });
      this.error = null;
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to load exercises';
    }
  }

  async changePage(page: number) {
    this.pagination.currentPage = page;
    await this.loadExercises();
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