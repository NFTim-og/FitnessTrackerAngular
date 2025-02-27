import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { WorkoutPlanListComponent } from './workout-plan-list.component';
import { WorkoutPlanService } from '../../../services/workout-plan.service';
import { Exercise } from '../../../models/exercise.model';
import { WorkoutPlan, WorkoutExercise } from '../../../models/workout-plan.model';
import { of } from 'rxjs';

describe('WorkoutPlanListComponent', () => {
  let component: WorkoutPlanListComponent;
  let fixture: ComponentFixture<WorkoutPlanListComponent>;
  let workoutPlanService: jasmine.SpyObj<WorkoutPlanService>;

  const mockExercises = [
    new Exercise({
      id: '1',
      name: 'Push-ups',
      duration: 10,
      calories: 100,
      difficulty: 'medium',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      met_value: 5
    })
  ];

  const mockWorkoutPlans = [
    new WorkoutPlan({
      id: '1',
      name: 'Full Body Workout',
      description: 'Complete workout routine',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      exercises: [
        new WorkoutExercise({
          id: '1',
          workout_plan_id: '1',
          exercise_id: '1',
          order: 1,
          exercise: mockExercises[0]
        })
      ]
    })
  ];

  beforeEach(async () => {
    const workoutPlanServiceSpy = jasmine.createSpyObj('WorkoutPlanService', [
      'loadWorkoutPlans',
      'searchWorkoutPlans',
      'deleteWorkoutPlan'
    ], {
      workoutPlans$: of(mockWorkoutPlans),
      totalCount$: of(1)
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: WorkoutPlanService, useValue: workoutPlanServiceSpy }
      ]
    }).compileComponents();

    workoutPlanService = TestBed.inject(WorkoutPlanService) as jasmine.SpyObj<WorkoutPlanService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workout plans on init', () => {
    expect(workoutPlanService.loadWorkoutPlans).toHaveBeenCalled();
    expect(component.workoutPlans).toEqual(mockWorkoutPlans);
  });

  it('should get exercises from workout plan', () => {
    const exercises = component.getExercises(mockWorkoutPlans[0]);
    expect(exercises).toEqual([mockExercises[0]]);
  });

  it('should search workout plans', async () => {
    const searchResults = [mockWorkoutPlans[0]];
    workoutPlanService.searchWorkoutPlans.and.returnValue(Promise.resolve());

    component.searchQuery = 'full';
    await component.onSearch();

    expect(workoutPlanService.searchWorkoutPlans).toHaveBeenCalledWith('full', {
      page: 1,
      perPage: 1
    });
    expect(component.workoutPlans).toEqual(searchResults);
  });

  it('should delete workout plan after confirmation', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    workoutPlanService.deleteWorkoutPlan.and.returnValue(Promise.resolve());

    await component.deleteWorkoutPlan('1');

    expect(workoutPlanService.deleteWorkoutPlan).toHaveBeenCalledWith('1');
  });

  it('should not delete workout plan if not confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    await component.deleteWorkoutPlan('1');

    expect(workoutPlanService.deleteWorkoutPlan).not.toHaveBeenCalled();
  });
});