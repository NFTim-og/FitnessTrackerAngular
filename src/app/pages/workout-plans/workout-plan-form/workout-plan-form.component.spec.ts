import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { WorkoutPlanFormComponent } from './workout-plan-form.component';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { ExerciseService } from '../../../services/exercise.service';

describe('WorkoutPlanFormComponent', () => {
  let component: WorkoutPlanFormComponent;
  let fixture: ComponentFixture<WorkoutPlanFormComponent>;
  let workoutPlanService: jasmine.SpyObj<WorkoutPlanService>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;
  let router: Router;

  const mockExercises = [
    {
      id: '1',
      name: 'Push-ups',
      duration: 10,
      calories: 100,
      difficulty: 'medium' as const,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      met_value: 5
    }
  ];

  beforeEach(async () => {
    const workoutPlanServiceSpy = jasmine.createSpyObj('WorkoutPlanService', [
      'getWorkoutPlan',
      'createWorkoutPlan',
      'updateWorkoutPlan'
    ]);

    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', 
      ['loadExercises'],
      { data$: of(mockExercises) } // Mock exercises$ observable
    );
    exerciseServiceSpy.loadExercises.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: WorkoutPlanService, useValue: workoutPlanServiceSpy },
        { provide: ExerciseService, useValue: exerciseServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    workoutPlanService = TestBed.inject(WorkoutPlanService) as jasmine.SpyObj<WorkoutPlanService>;
    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exercises on init', async () => {
    // Act: ngOnInit is called in beforeEach, but ensure async operations are complete
    fixture.detectChanges(); // Trigger ngOnInit
  
    // Wait for all async operations to settle
    await fixture.whenStable();
  
    // Assert
    expect(exerciseService.loadExercises).toHaveBeenCalled();
    expect(component.exercises.length).toBeGreaterThan(0); // Ensure exercises are loaded
    expect(component.exercises).toEqual(mockExercises); // Verify exercises loaded correctly
  });
  

  it('should add and remove exercises', () => {
    // Arrange: Ensure exercises are loaded
    component.exercises = mockExercises;
    const event = { target: { value: '1' } } as unknown as Event;

    // Act: Add exercise
    component.addExercise(event);
    fixture.detectChanges(); // Trigger change detection

    // Assert: Verify exercise is added
    expect(component.selectedExercises).toContain(mockExercises[0]);

    // Act: Remove exercise
    component.removeExercise(mockExercises[0]);
    fixture.detectChanges(); // Trigger change detection

    // Assert: Verify exercise is removed
    expect(component.selectedExercises).not.toContain(mockExercises[0]);
  });
});