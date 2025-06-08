import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { AppError } from '../../../shared/models/error.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WorkoutPlan } from '../../../models/workout-plan.model';
import { Exercise } from '../../../models/exercise.model';
import { PaginationState } from '../../../shared/models/pagination.model';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { IconService } from '../../../shared/services/icon.service';

@Component({
  selector: 'app-workout-plan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './workout-plan-list.component.html',
  styleUrls: ['./workout-plan-list.component.css']
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

  constructor(
    private workoutPlanService: WorkoutPlanService,
    public iconService: IconService,
    private router: Router
  ) {
    this.workoutPlanService.totalCount$.subscribe(count => {
      this.pagination = new PaginationState({
        currentPage: this.pagination.currentPage,
        totalCount: count,
        perPage: this.pagination.perPage
      });
    });
  }

  ngOnInit() {
    this.workoutPlanService.workoutPlans$.subscribe(
      plans => {
        this.workoutPlans = plans;
      }
    );
    this.loadWorkoutPlans();
  }

  loadWorkoutPlans() {
    this.workoutPlanService.loadWorkoutPlans({
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage
    }).subscribe({
      next: () => {
        this.error = null;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to load workout plans';
      }
    });
  }



  onSearch() {
    this.pagination = new PaginationState({
      ...this.pagination,
      currentPage: 1
    });
    this.workoutPlanService.searchWorkoutPlans(
      this.searchQuery,
      {
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      }
    ).subscribe({
      next: () => {
        this.error = null;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to search workout plans';
      }
    });
  }

  changePage(page: number) {
    this.pagination = new PaginationState({
      ...this.pagination,
      currentPage: page
    });
    if (this.searchQuery) {
      this.workoutPlanService.searchWorkoutPlans(
        this.searchQuery,
        {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        }
      ).subscribe({
        error: (error) => {
          this.error = error instanceof AppError ? error.message : 'Failed to load page';
        }
      });
    } else {
      this.loadWorkoutPlans();
    }
  }

  deleteWorkoutPlan(id: string) {
    if (!confirm('Are you sure you want to delete this workout plan?')) return;

    this.workoutPlanService.deleteWorkoutPlan(id).subscribe({
      next: () => {
        this.error = null;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to delete workout plan';
      }
    });
  }

  openWorkoutPlan(id: string) {
    this.router.navigate(['/workout-plans', id]);
  }
}