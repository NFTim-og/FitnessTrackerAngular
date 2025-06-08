import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppError } from '../../../shared/models/error.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/exercise.model';
import { Subscription } from 'rxjs';
import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';

import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MaterialButtonComponent } from '../../../shared/components/material-button/material-button.component';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    LoadingSpinnerComponent,
    MaterialButtonComponent
  ],
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit, OnDestroy {
  exerciseForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  error: string | null = null;
  showMetInfo = false;
  estimatedCalories = 0;

  muscleGroupOptions = [
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'core', label: 'Core' },
    { value: 'legs', label: 'Legs' },
    { value: 'glutes', label: 'Glutes' },
    { value: 'full_body', label: 'Full Body' }
  ];
  private profileSubscription: Subscription;
  private formSubscription: Subscription;

  // Loading states
  isLoadingExercise$ = this.loadingService.isLoading('loadExercise');
  isSavingExercise$ = this.loadingService.isLoading('saveExercise');

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {
    this.exerciseForm = this.fb.group({
      name: ['', [
        Validators.required,
        ValidationService.minLengthValidator(1),
        ValidationService.maxLengthValidator(100)
      ]],
      description: ['', [
        ValidationService.maxLengthValidator(1000)
      ]],
      category: ['', [
        Validators.required,
        ValidationService.optionsValidator(['cardio', 'strength', 'flexibility', 'balance'])
      ]],
      duration_minutes: ['', [
        Validators.required,
        ValidationService.positiveNumberValidator(),
        ValidationService.rangeValidator(1, 300)
      ]],
      calories_per_minute: ['', [
        Validators.required,
        ValidationService.positiveNumberValidator(),
        ValidationService.rangeValidator(0.1, 50)
      ]],
      difficulty: ['', [
        Validators.required,
        ValidationService.optionsValidator(['beginner', 'intermediate', 'advanced'])
      ]],
      met_value: [4.0, [
        Validators.required,
        ValidationService.positiveNumberValidator(),
        ValidationService.rangeValidator(0.1, 20)
      ]],
      equipment_needed: [''],
      custom_equipment: ['', [
        ValidationService.minLengthValidator(1),
        ValidationService.maxLengthValidator(50)
      ]],
      muscle_groups: [[]],
      instructions: [''],
      is_public: [true]
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
    this.loadingService.start('loadExercise');

    this.exerciseService.getExercise(id).subscribe({
      next: (exercise) => {
        if (exercise) {
          // Convert API response to form format
          const apiData = exercise as any; // Cast to any to access both camelCase and snake_case properties
          const formData = {
            name: apiData.name,
            description: apiData.description || '',
            category: apiData.category,
            duration_minutes: apiData.durationMinutes || apiData.duration_minutes,
            calories_per_minute: apiData.caloriesPerMinute || apiData.calories_per_minute,
            difficulty: apiData.difficulty,
            met_value: apiData.metValue || apiData.met_value,
            equipment_needed: apiData.equipmentNeeded || apiData.equipment_needed || '',
            custom_equipment: apiData.customEquipment || apiData.custom_equipment || '',
            muscle_groups: apiData.muscleGroups || apiData.muscle_groups || [],
            instructions: apiData.instructions || '',
            is_public: apiData.isPublic !== undefined ? apiData.isPublic : (apiData.is_public !== false)
          };
          this.exerciseForm.patchValue(formData);
          this.updateCalories();
          this.error = null;
        }
        this.loadingService.stop('loadExercise');
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : 'Failed to load exercise';
        this.loadingService.stop('loadExercise');
      }
    });
  }

  showError(field: string) {
    const control = this.exerciseForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  getFieldError(fieldName: string): string | null {
    const control = this.exerciseForm.get(fieldName);
    return ValidationService.getFirstErrorMessage(fieldName, control);
  }

  getFormControl(fieldName: string) {
    return this.exerciseForm.get(fieldName);
  }

  onMuscleGroupChange(muscleGroup: string, event: any) {
    const currentGroups = this.exerciseForm.get('muscle_groups')?.value || [];
    if (event.target.checked) {
      if (!currentGroups.includes(muscleGroup)) {
        this.exerciseForm.patchValue({
          muscle_groups: [...currentGroups, muscleGroup]
        });
      }
    } else {
      this.exerciseForm.patchValue({
        muscle_groups: currentGroups.filter((group: string) => group !== muscleGroup)
      });
    }
  }

  isMuscleGroupSelected(muscleGroup: string): boolean {
    const currentGroups = this.exerciseForm.get('muscle_groups')?.value || [];
    return currentGroups.includes(muscleGroup);
  }

  onEquipmentChange(event: any) {
    const selectedValue = event.value;
    const customEquipmentControl = this.exerciseForm.get('custom_equipment');

    if (selectedValue === 'custom') {
      // Enable and require custom equipment field
      customEquipmentControl?.setValidators([
        Validators.required,
        ValidationService.minLengthValidator(1),
        ValidationService.maxLengthValidator(50)
      ]);
      customEquipmentControl?.enable();
    } else {
      // Disable and clear custom equipment field
      customEquipmentControl?.clearValidators();
      customEquipmentControl?.setValue('');
      customEquipmentControl?.disable();
    }
    customEquipmentControl?.updateValueAndValidity();
  }

  isCustomEquipmentSelected(): boolean {
    return this.exerciseForm.get('equipment_needed')?.value === 'custom';
  }

  getMuscleGroupIcon(muscleGroup: string): string {
    const iconMap: { [key: string]: string } = {
      'chest': 'fitness_center',
      'back': 'fitness_center',
      'shoulders': 'fitness_center',
      'arms': 'fitness_center',
      'core': 'center_focus_strong',
      'legs': 'directions_walk',
      'glutes': 'fitness_center',
      'full_body': 'accessibility'
    };
    return iconMap[muscleGroup] || 'fitness_center';
  }

  updateCalories() {
    const duration = this.exerciseForm.get('duration_minutes')?.value;
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
    if (this.exerciseForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.exerciseForm.markAllAsTouched();
      return;
    }



    this.loadingService.start('saveExercise');
    this.isSubmitting = true;
    try {
      this.updateCalories();

      const formValues = this.exerciseForm.value;

      // Handle equipment logic
      let finalEquipment = formValues.equipment_needed || 'none';
      if (formValues.equipment_needed === 'custom' && formValues.custom_equipment) {
        finalEquipment = formValues.custom_equipment.trim();
      } else if (!formValues.equipment_needed) {
        finalEquipment = 'none';
      }

      const exercise = new Exercise({
        name: formValues.name,
        description: formValues.description || '',
        category: formValues.category,
        duration_minutes: Number(formValues.duration_minutes),
        calories_per_minute: Number(formValues.calories_per_minute),
        difficulty: formValues.difficulty,
        met_value: Number(formValues.met_value),
        equipment_needed: finalEquipment,
        muscle_groups: formValues.muscle_groups || [],
        instructions: formValues.instructions || '',
        is_public: formValues.is_public !== false
      });

      if (this.isEditing) {
        const exerciseId = this.route.snapshot.params['id'];
        const updateData = {
          name: exercise.name,
          description: exercise.description,
          category: exercise.category,
          duration_minutes: exercise.duration_minutes,
          calories_per_minute: exercise.calories_per_minute,
          difficulty: exercise.difficulty,
          met_value: exercise.met_value,
          equipment_needed: exercise.equipment_needed,
          muscle_groups: exercise.muscle_groups,
          instructions: exercise.instructions,
          is_public: exercise.is_public
        };
        await this.exerciseService.updateExercise(exerciseId, updateData);
      } else {
        await this.exerciseService.createExercise(exercise.toJSON());
      }
      this.router.navigate(['/exercises']);
      this.error = null;
    } catch (error) {
      this.error = error instanceof AppError ? error.message : 'Failed to save exercise';
    } finally {
      this.isSubmitting = false;
      this.loadingService.stop('saveExercise');
    }
  }

  goBack() {
    this.router.navigate(['/exercises']);
  }
}