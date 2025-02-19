import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { WorkoutPlan, Exercise } from '../../../models/types';
import { PaginationState } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-workout-plan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-4">My Workout Plans</h1>
        <div class="flex gap-4 mb-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search workout plans..."
            class="form-control"
          />
        </div>
        <button
          [routerLink]="['/workout-plans/new']"
          class="btn btn-primary"
        >
          Create New Plan
        </button>
      </div>

      <app-pagination
        [currentPage]="pagination.currentPage"
        [totalCount]="pagination.totalCount"
        [perPage]="pagination.perPage"
        (pageChange)="changePage($event)"
      ></app-pagination>

      <div class="grid grid-cols-1 gap-4">
        @for (plan of workoutPlans; track plan.id) {
          <div class="card">
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ plan.name }}</h3>
              <div class="prose max-w-none mb-4">
                <pre class="text-gray-600 whitespace-pre-wrap font-sans text-base break-words">{{ plan.description }}</pre>
              </div>
              
              @if (plan.exercises && plan.exercises.length > 0) {
                <div class="mb-4">
                  <h4 class="font-medium mb-2">Exercises:</h4>
                  <ul class="list-disc list-inside">
                    @for (exercise of getExercises(plan); track exercise.id) {
                      <li>{{ exercise.name }}</li>
                    }
                  </ul>
                </div>
              }

              <div class="flex gap-2">
                <button
                  [routerLink]="['/workout-plans', plan.id, 'edit']"
                  class="btn btn-primary"
                >
                  Edit
                </button>
                <button
                  (click)="deleteWorkoutPlan(plan.id)"
                  class="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})

export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: WorkoutPlan[] = [];
  searchQuery = '';
  pagination: PaginationState = {
    currentPage: 1,
    totalCount: 0,
    perPage: 1  // Show one workout plan at a time
  };

  constructor(private workoutPlanService: WorkoutPlanService) {
    this.workoutPlanService.totalCount$.subscribe(count => {
      this.pagination = { ...this.pagination, totalCount: count };
    });
  }

  ngOnInit() {
    this.workoutPlanService.workoutPlans$.subscribe(
      plans => this.workoutPlans = plans
    );
    this.loadWorkoutPlans();
  }

  async loadWorkoutPlans() {
    try {
      await this.workoutPlanService.loadWorkoutPlans({
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      });
    } catch (error) {
      console.error('Error loading workout plans:', error);
    }
  }

  getExercises(plan: WorkoutPlan): Exercise[] {
    return plan.exercises
      ?.filter(we => we.exercise)
      .map(we => we.exercise!)
      .sort((a, b) => a.name.localeCompare(b.name)) || [];
  }

  async onSearch() {
    this.pagination.currentPage = 1; // Reset to first page when searching
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
    this.pagination.currentPage = page;
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
    } catch (error) {
      console.error('Error deleting workout plan:', error);
    }
  }
}