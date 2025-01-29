import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ExerciseListComponent } from './exercise-list.component';
import { ExerciseService } from '../../../services/exercise.service';
import { of } from 'rxjs';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;

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
    },
    {
      id: '2',
      name: 'Squats',
      duration: 15,
      calories: 150,
      difficulty: 'hard' as const,
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      met_value: 6
    }
  ];

  beforeEach(async () => {
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'loadExercises',
      'searchExercises',
      'deleteExercise'
    ], {
      exercises$: of(mockExercises)
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: ExerciseService, useValue: exerciseServiceSpy }
      ]
    }).compileComponents();

    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseListComponent);
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

  it('should search exercises', async () => {
    const searchResults = [mockExercises[0]];
    exerciseService.searchExercises.and.returnValue(Promise.resolve(searchResults));

    component.searchQuery = 'push';
    await component.onSearch();

    expect(exerciseService.searchExercises).toHaveBeenCalledWith('push', '');
    expect(component.exercises).toEqual(searchResults);
  });

  it('should delete exercise after confirmation', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    exerciseService.deleteExercise.and.returnValue(Promise.resolve());

    await component.deleteExercise('1');

    expect(exerciseService.deleteExercise).toHaveBeenCalledWith('1');
  });

  it('should not delete exercise if not confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    await component.deleteExercise('1');

    expect(exerciseService.deleteExercise).not.toHaveBeenCalled();
  });
});