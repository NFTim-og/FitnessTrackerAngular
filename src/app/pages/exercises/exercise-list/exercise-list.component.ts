import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppError } from '../../../shared/models/error.model';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/types';
import { PaginationState } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent],
  templateUrl: './exercise-list.component.html',
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
  error: string | null = null;
  userProfile$ = this.userProfileService.profile$;
  pagination: PaginationState = {
    currentPage: 1,
    totalCount: 0,
    perPage: 6
  };

  constructor(
    private exerciseService: ExerciseService,
    private userProfileService: UserProfileService
  ) {
    this.exerciseService.totalCount$.subscribe(count => {
      this.pagination = { ...this.pagination, totalCount: count };
    });
  }

  ngOnInit() {
    this.exerciseService.data$.subscribe(
      exercises => this.exercises = exercises
    );
    this.loadExercises();
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
      // TODO: Add error handling
    }
  }

  async onSearch() {
    this.pagination.currentPage = 1; // Reset to first page when searching
    try {
      await this.exerciseService.searchExercises(
        this.searchQuery,
        this.selectedDifficulty,
        {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        }
      );
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to search exercises';
      // TODO: Add error handling
    }
  }

  async changePage(page: number) {
    this.pagination.currentPage = page;
    if (this.searchQuery || this.selectedDifficulty) {
      await this.exerciseService.searchExercises(
        this.searchQuery,
        this.selectedDifficulty,
        {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        }
      );
    } else {
      await this.loadExercises();
    }
  }
  async deleteExercise(id: string) {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await this.exerciseService.deleteExercise(id);
      this.error = null;
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to delete exercise';
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