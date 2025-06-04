import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppError } from '../../../shared/models/error.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/exercise.model';
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
  private formSubscription: Subscription;

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

    this.formSubscription = this.exerciseForm.valueChanges.subscribe(() => {
      this.updateCalories();
    });
  }

  ngOnInit() {
    const exerciseId = this.route.snapshot.params['id'];
    if (exerciseId) {
      this.isEditing = true;
      this.loadExercise(exerciseId);
    } else {
    this.updateCalories();
    }
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  loadExercise(id: string) {
    this.exerciseService.getExercise(id).subscribe({
      next: (exercise) => {
        if (exercise) {
          this.exerciseForm.patchValue(exercise);
          this.updateCalories();
          this.error = null;
        }
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to load exercise';
      }
    });
  }

  showError(field: string) {
    const control = this.exerciseForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  updateCalories() {
    const duration = this.exerciseForm.get('duration')?.value;
    const metValue = this.exerciseForm.get('met_value')?.value;

    // Make sure we call calculateCalories even with default values
    if (duration && metValue) {
      this.estimatedCalories = this.userProfileService.calculateCalories(metValue, duration);
    } else if (metValue) {
      // Force a call with at least the MET value
      this.estimatedCalories = this.userProfileService.calculateCalories(metValue, 0);
    } else {
      this.estimatedCalories = 0;
    }
  }

  async onSubmit() {
    if (this.exerciseForm.invalid) return;

    console.log('ExerciseFormComponent - Form submitted');
    console.log('ExerciseFormComponent - Form values:', this.exerciseForm.value);

    this.isSubmitting = true;
    try {
      this.updateCalories();

      const formValues = this.exerciseForm.value;
      const exercise = new Exercise({
        name: formValues.name,
        duration: Number(formValues.duration),
        met_value: Number(formValues.met_value),
        difficulty: formValues.difficulty,
        calories: this.estimatedCalories
      });

      console.log('ExerciseFormComponent - Exercise object:', exercise);

      if (this.isEditing) {
        const exerciseId = this.route.snapshot.params['id'];
        console.log('ExerciseFormComponent - Updating exercise with ID:', exerciseId);
        const updateData = {
          name: exercise.name,
          duration: exercise.duration,
          met_value: exercise.met_value,
          difficulty: exercise.difficulty,
          calories: exercise.calories
        };
        await this.exerciseService.updateExercise(exerciseId, updateData);
        console.log('ExerciseFormComponent - Exercise updated successfully');
      } else {
        console.log('ExerciseFormComponent - Creating new exercise');
        await this.exerciseService.createExercise(exercise);
        console.log('ExerciseFormComponent - Exercise created successfully');
      }
      this.router.navigate(['/exercises']);
      this.error = null;
    } catch (error) {
      console.error('ExerciseFormComponent - Error saving exercise:', error);
      this.error = error instanceof AppError ? error.message : 'Failed to save exercise';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/exercises']);
  }
}