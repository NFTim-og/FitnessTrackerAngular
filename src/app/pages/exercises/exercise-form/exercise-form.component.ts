import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppError } from '../../../shared/models/error.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exercise-form.component.html',
  styles: []
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  exerciseForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  error: string | null = null;
  showMetInfo = false;
  estimatedCalories = 0;
  private profileSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exerciseForm = this.fb.group({
      name: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]],
      met_value: [4.0, [Validators.required, Validators.min(0.1)]],
      difficulty: ['', [Validators.required]]
    });

    // Subscribe to profile changes to update calories when weight changes
    this.profileSubscription = this.userProfileService.profile$.subscribe(() => {
      this.updateCalories();
    });
  }

  ngOnInit() {
    const exerciseId = this.route.snapshot.params['id'];
    if (exerciseId) {
      this.isEditing = true;
      this.loadExercise(exerciseId);
    }
    this.updateCalories();
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  async loadExercise(id: string) {
    try {
      const exercise = await this.exerciseService.getExercise(id);
      if (exercise) {
        this.exerciseForm.patchValue(exercise);
        this.updateCalories();
        this.error = null;
      }
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to load exercise';
    }
  }

  showError(field: string) {
    const control = this.exerciseForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  updateCalories() {
    const duration = this.exerciseForm.get('duration')?.value;
    const metValue = this.exerciseForm.get('met_value')?.value;
    
    if (duration && metValue) {
      this.estimatedCalories = this.userProfileService.calculateCalories(metValue, duration);
    } else {
      this.estimatedCalories = 0;
    }
  }

  async onSubmit() {
    if (this.exerciseForm.invalid) return;

    this.isSubmitting = true;
    try {
      const formData = {
        ...this.exerciseForm.value,
        calories: 0 // This will be calculated dynamically when displayed
      };

      if (this.isEditing) {
        const exerciseId = this.route.snapshot.params['id'];
        await this.exerciseService.updateExercise(exerciseId, formData);
      } else {
        await this.exerciseService.createExercise(formData);
      }
      this.router.navigate(['/exercises']);
      this.error = null;
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to save exercise';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/exercises']);
  }
}