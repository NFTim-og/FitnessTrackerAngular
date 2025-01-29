import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { WorkoutPlan, Exercise } from '../../../models/types';

@Component({
  selector: 'app-workout-plan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (plan of workoutPlans; track plan.id) {
          <div class="card">
            <h3 class="text-xl font-semibold mb-2">{{ plan.name }}</h3>
            <pre class="text-gray-600 mb-4 whitespace-pre-wrap font-sans text-base">{{ plan.description }}</pre>
            
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
        }
      </div>
    </div>
  `
})

export class WorkoutPlanListComponent implements OnInit {
  workoutPlans: WorkoutPlan[] = [];
  searchQuery = '';

  constructor(private workoutPlanService: WorkoutPlanService) {}

  ngOnInit() {
    this.workoutPlanService.workoutPlans$.subscribe(
      plans => this.workoutPlans = plans
    );
    this.loadWorkoutPlans();
  }

  async loadWorkoutPlans() {
    try {
      await this.workoutPlanService.loadWorkoutPlans();
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
    try {
      const results = await this.workoutPlanService.searchWorkoutPlans(this.searchQuery);
      this.workoutPlans = results;
    } catch (error) {
      console.error('Error searching workout plans:', error);
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