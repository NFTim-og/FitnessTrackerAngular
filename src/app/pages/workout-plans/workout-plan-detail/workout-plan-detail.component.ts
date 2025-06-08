import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { WorkoutPlan } from '../../../models/workout-plan.model';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { IconService } from '../../../shared/services/icon.service';
import { AppError } from '../../../shared/models/error.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-workout-plan-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './workout-plan-detail.component.html',
  styles: [`
    .workout-plan-detail-card {
      background: var(--card-background);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
    }

    .workout-plan-meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .exercise-card {
      background: var(--card-background);
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
    }

    .exercise-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
  `]
})
export class WorkoutPlanDetailComponent implements OnInit {
  workoutPlan: WorkoutPlan | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutPlanService: WorkoutPlanService,
    private errorHandler: ErrorHandlerService,
    public iconService: IconService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadWorkoutPlan(id);
    }
  }

  loadWorkoutPlan(id: string) {
    this.isLoading = true;
    this.error = null;

    this.workoutPlanService.getWorkoutPlan(id).subscribe({
      next: (workoutPlan) => {
        this.workoutPlan = workoutPlan;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to load workout plan';
        this.isLoading = false;
      }
    });
  }

  editWorkoutPlan() {
    if (this.workoutPlan) {
      this.router.navigate(['/workout-plans', this.workoutPlan.id, 'edit']);
    }
  }

  deleteWorkoutPlan() {
    if (!this.workoutPlan) return;

    if (confirm('Are you sure you want to delete this workout plan?')) {
      this.workoutPlanService.deleteWorkoutPlan(this.workoutPlan.id).subscribe({
        next: () => {
          this.router.navigate(['/workout-plans']);
        },
        error: (error) => {
          this.error = error instanceof AppError ? error.message : 'Failed to delete workout plan';
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/workout-plans']);
  }

  getTotalDuration(): number {
    if (!this.workoutPlan?.exercises) return 0;
    return this.workoutPlan.exercises.reduce((total: number, we: any) => {
      return total + (we.exercise?.duration_minutes || 0);
    }, 0);
  }

  getTotalCalories(): number {
    if (!this.workoutPlan?.exercises) return 0;
    return this.workoutPlan.exercises.reduce((total: number, we: any) => {
      const exercise = we.exercise;
      if (exercise) {
        return total + (exercise.calories_per_minute * exercise.duration_minutes);
      }
      return total;
    }, 0);
  }
}
