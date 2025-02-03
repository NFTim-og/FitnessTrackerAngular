import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/types';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-4">My Exercises</h1>
      <div class="flex gap-4 mb-4">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          placeholder="Search exercises..."
          class="form-control"
        />
        <select
          [(ngModel)]="selectedDifficulty"
          (change)="onSearch()"
          class="form-control"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        [routerLink]="['/exercises/new']"
        class="btn btn-primary"
      >
        Add New Exercise
      </button>
    </div>

    @if (totalPages > 1) {
      <div class="flex justify-center gap-2 mb-6">
        <button
          class="btn btn-secondary"
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)"
        >
          Previous
        </button>
        
        @for (page of pages; track page) {
          <button
            class="btn"
            [class.btn-primary]="currentPage === page"
            [class.btn-secondary]="currentPage !== page"
            (click)="changePage(page)"
          >
            {{ page }}
          </button>
        }

        <button
          class="btn btn-secondary"
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    }

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (exercise of exercises; track exercise.id) {
        <div class="card">
          <h3 class="text-xl font-semibold mb-2">{{ exercise.name }}</h3>
          <div class="mb-4">
            <p>Duration: {{ exercise.duration }} minutes</p>
            <p>
              Calories: {{ calculateCalories(exercise) }}
              @if (!userProfile) {
                <span class="text-sm text-gray-500">
                  (Set your weight in profile for accurate calculation)
                </span>
              }
            </p>
            <p class="capitalize">Difficulty: {{ exercise.difficulty }}</p>
            <p class="text-sm text-gray-600">MET: {{ exercise.met_value }}</p>
          </div>
          <div class="flex gap-2">
            <button
              [routerLink]="['/exercises', exercise.id, 'edit']"
              class="btn btn-primary"
            >
              Edit
            </button>
            <button
              (click)="deleteExercise(exercise.id)"
              class="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .btn-danger {
      background-color: var(--danger-color);
      color: white;
    }
    .btn-danger:hover {
      background-color: #dc2626;
    }
  `]
})
export class ExerciseListComponent implements OnInit {
  exercises: Exercise[] = [];
  searchQuery = '';
  selectedDifficulty = '';
  userProfile = this.userProfileService.profile$;
  currentPage = 1;
  totalCount = 0;
  readonly perPage = 6;

  constructor(
    private exerciseService: ExerciseService,
    private userProfileService: UserProfileService
  ) {
    this.exerciseService.totalCount$.subscribe(count => this.totalCount = count);
  }

  ngOnInit() {
    this.exerciseService.exercises$.subscribe(
      exercises => this.exercises = exercises
    );
    this.loadExercises();
  }

  async loadExercises() {
    try {
      await this.exerciseService.loadExercises(this.currentPage, this.perPage);
    } catch (error) {
      console.error('Error loading exercises:', error);
      // TODO: Add error handling
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.perPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  async onSearch() {
    this.currentPage = 1; // Reset to first page when searching
    try {
      await this.exerciseService.searchExercises(
        this.searchQuery,
        this.selectedDifficulty,
        this.currentPage,
        this.perPage
      );
    } catch (error) {
      console.error('Error searching exercises:', error);
      // TODO: Add error handling
    }
  }

  async changePage(page: number) {
    this.currentPage = page;
    if (this.searchQuery || this.selectedDifficulty) {
      await this.exerciseService.searchExercises(
        this.searchQuery,
        this.selectedDifficulty,
        this.currentPage,
        this.perPage
      );
    } else {
      await this.loadExercises();
    }
  }
  async deleteExercise(id: string) {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await this.exerciseService.deleteExercise(id);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      // TODO: Add error handling
    }
  }

  calculateCalories(exercise: Exercise): number {
    return this.userProfileService.calculateCalories(
      exercise.met_value,
      exercise.duration
    );
  }
}