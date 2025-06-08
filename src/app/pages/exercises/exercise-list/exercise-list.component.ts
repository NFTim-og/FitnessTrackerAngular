import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppError } from '../../../shared/models/error.model';
import { FormsModule } from '@angular/forms';

import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { IconService } from '../../../shared/services/icon.service';
import { Exercise } from '../../../models/types';
import { PaginationState } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    LoadingSpinnerComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
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

  // Loading states
  isLoadingExercises$ = this.loadingService.isLoading('loadExercises');
  isCreatingExercise$ = this.loadingService.isLoading('createExercise');

  constructor(
    private exerciseService: ExerciseService,
    private userProfileService: UserProfileService,
    private loadingService: LoadingService,
    public iconService: IconService,
    private cdr: ChangeDetectorRef
  ) {
    this.exerciseService.totalCount$.subscribe(count => {
      this.pagination = { ...this.pagination, totalCount: count };
    });
  }

  ngOnInit() {
    // Subscribe to exercises data
    this.exerciseService.data$.subscribe(
      (exercises: any[]) => {
        this.exercises = exercises;
        this.cdr.detectChanges();
      }
    );

    // Subscribe to total count for pagination
    this.exerciseService.totalCount$.subscribe(
      (totalCount: number) => {
        this.pagination.totalCount = totalCount;
      }
    );

    // Load exercises
    this.loadExercises();
  }

  loadExercises() {
    this.exerciseService.loadExercises({
      page: this.pagination.currentPage,
      perPage: this.pagination.perPage
    }).subscribe({
      next: () => {
        this.error = null;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to load exercises';
      }
    });
  }

  onSearch() {
    this.pagination.currentPage = 1; // Reset to first page when searching
    this.exerciseService.searchExercises(
      this.searchQuery,
      this.selectedDifficulty,
      {
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      }
    ).subscribe({
      next: () => {
        this.error = null;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to search exercises';
      }
    });
  }

  changePage(page: number) {
    this.pagination.currentPage = page;
    if (this.searchQuery || this.selectedDifficulty) {
      this.exerciseService.searchExercises(
        this.searchQuery,
        this.selectedDifficulty,
        {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        }
      ).subscribe({
        error: (error) => {
          this.error = error instanceof AppError ? error.message : 'Failed to search exercises';
        }
      });
    } else {
      this.loadExercises();
    }
  }
  deleteExercise(id: string) {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    this.exerciseService.deleteExercise(id).subscribe({
      next: () => {
        this.error = null;
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to delete exercise';
      }
    });
  }

  calculateCalories(exercise: Exercise): number {
    return this.userProfileService.calculateCalories(
      exercise.met_value,
      exercise.duration_minutes
    );
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedDifficulty = '';
    this.pagination.currentPage = 1;
    this.loadExercises();
  }
}