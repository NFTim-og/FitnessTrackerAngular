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
      created_at: new Date().toISOString()
    }
  ];

  const mockWorkoutPlan = {
    id: '1',
    name: 'Full Body Workout',
    description: 'Complete workout routine',
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    exercises: [
      {
        id: '1',
        workout_plan_id: '1',
        exercise_id: '1',
        order: 1,
        exercise: mockExercises[0]
      }
    ]
  };

  beforeEach(async () => {
    const workoutPlanServiceSpy = jasmine.createSpyObj('WorkoutPlanService', [
      'getWorkoutPlan',
      'createWorkoutPlan',
      'updateWorkoutPlan'
    ]);

    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'loadExercises'
    ], {
      exercises$: of(mockExercises)
    });

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.workoutForm.value).toEqual({
      name: '',
      description: ''
    });
  });

  it('should load exercises on init', () => {
    expect(exerciseService.loadExercises).toHaveBeenCalled();
    expect(component.exercises).toEqual(mockExercises);
  });

  it('should load workout plan when editing', async () => {
    workoutPlanService.getWorkoutPlan.and.returnValue(Promise.resolve(mockWorkoutPlan));
    
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: WorkoutPlanService, useValue: workoutPlanService },
        { provide: ExerciseService, useValue: exerciseService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
    expect(component.workoutForm.value).toEqual({
      name: mockWorkoutPlan.name,
      description: mockWorkoutPlan.description
    });
    expect(component.selectedExercises).toEqual([mockExercises[0]]);
  });

  it('should add and remove exercises', () => {
    const event = { target: { value: '1' } } as unknown as Event;
    component.addExercise(event);
    expect(component.selectedExercises).toContain(mockExercises[0]);

    component.removeExercise(mockExercises[0]);
    expect(component.selectedExercises).not.toContain(mockExercises[0]);
  });

  it('should create new workout plan', async () => {
    const newWorkoutPlan = {
      name: 'New Workout',
      description: 'New workout description'
    };

    workoutPlanService.createWorkoutPlan.and.returnValue(Promise.resolve({ ...newWorkoutPlan, id: '2' }));
    spyOn(router, 'navigate');

    component.workoutForm.patchValue(newWorkoutPlan);
    component.selectedExercises = mockExercises;
    await component.onSubmit();

    expect(workoutPlanService.createWorkoutPlan).toHaveBeenCalledWith(
      newWorkoutPlan,
      [{ id: mockExercises[0].id, order: 1 }]
    );
    expect(router.navigate).toHaveBeenCalledWith(['/workout-plans']);
  });
});