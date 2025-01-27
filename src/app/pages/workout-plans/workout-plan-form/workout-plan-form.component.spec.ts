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

  beforeEach(async () => {
    const workoutPlanServiceSpy = jasmine.createSpyObj('WorkoutPlanService', [
      'getWorkoutPlan',
      'createWorkoutPlan',
      'updateWorkoutPlan'
    ]);

    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', 
      ['loadExercises'],
      { exercises$: of(mockExercises) }
    );

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

  it('should load exercises on init', () => {
    expect(exerciseService.loadExercises).toHaveBeenCalled();
    expect(component.exercises).toEqual(mockExercises);
  });

  it('should add and remove exercises', () => {
    const event = { target: { value: '1' } } as unknown as Event;
    component.addExercise(event);
    expect(component.selectedExercises).toContain(mockExercises[0]);

    component.removeExercise(mockExercises[0]);
    expect(component.selectedExercises).not.toContain(mockExercises[0]);
  });
});