import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AppError } from '../../../shared/models/error.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WorkoutPlan } from '../../../models/workout-plan.model';
import { Exercise } from '../../../models/exercise.model';
import { PaginationState } from '../../../shared/models/pagination.model';
import { WorkoutPlanService } from '../../../services/workout-plan.service';

@Component({
  selector: 'app-workout-plan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './workout-plan-list.component.html'
})
export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: WorkoutPlan[] = [];
  searchQuery = '';
  error: string | null = null;
  pagination: PaginationState = new PaginationState({
    currentPage: 1,
    totalCount: 0,
    perPage: 6  // Increased from 1 to 6 to show more workout plans per page
  });

  constructor(private workoutPlanService: WorkoutPlanService) {
    this.workoutPlanService.totalCount$.subscribe(count => {
      this.pagination = new PaginationState({
        currentPage: this.pagination.currentPage,
        totalCount: count,
        perPage: this.pagination.perPage
      });
    });
  }

  ngOnInit() {
    console.log('WorkoutPlanListComponent - Initializing');
    this.workoutPlanService.workoutPlans$.subscribe(
      plans => {
        console.log('WorkoutPlanListComponent - Received workout plans:', plans);
        this.workoutPlans = plans;
      }
    );
    this.loadWorkoutPlans();
  }

  async loadWorkoutPlans() {
    console.log('WorkoutPlanListComponent - Loading workout plans');
    try {
      await this.workoutPlanService.loadWorkoutPlans({
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      });
      console.log('WorkoutPlanListComponent - Workout plans loaded successfully');
      console.log('WorkoutPlanListComponent - Current workout plans:', this.workoutPlans);
      console.log('WorkoutPlanListComponent - Pagination:', this.pagination);
      this.error = null;
    } catch (error) {
      console.error('WorkoutPlanListComponent - Error loading workout plans:', error);
      this.error = error instanceof AppError ? error.message : 'Failed to load workout plans';
    }
  }

  getExercises(plan: WorkoutPlan): Exercise[] {
    return plan.getExercises();
  }

  async onSearch() {
    this.pagination = new PaginationState({
      ...this.pagination,
      currentPage: 1
    });
    try {
      await this.workoutPlanService.searchWorkoutPlans(
        this.searchQuery,
        {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        }
      );
    } catch (error) {
      console.error('Error searching workout plans:', error);
    }
  }

  async changePage(page: number) {
    this.pagination = new PaginationState({
      ...this.pagination,
      currentPage: page
    });
    if (this.searchQuery) {
      await this.workoutPlanService.searchWorkoutPlans(
        this.searchQuery,
        {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        }
      );
    } else {
      await this.loadWorkoutPlans();
    }
  }

  async deleteWorkoutPlan(id: string) {
    if (!confirm('Are you sure you want to delete this workout plan?')) return;

    try {
      await this.workoutPlanService.deleteWorkoutPlan(id);
      this.error = null;
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to delete workout plan';
    }
  }
}