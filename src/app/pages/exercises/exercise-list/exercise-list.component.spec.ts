import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ExerciseListComponent } from './exercise-list.component';
import { ExerciseService } from '../../../services/exercise.service';
import { BehaviorSubject, of, EMPTY } from 'rxjs';
import { Exercise } from '../../../models/types';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;
  let dataSubject: BehaviorSubject<Exercise[]>;
  let totalCountSubject: BehaviorSubject<number>;

  const mockExercises: Exercise[] = [
    {
      id: '1',
      name: 'Push-ups',
      duration: 10,
      calories: 100,
      difficulty: 'medium',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      met_value: 5
    },
    {
      id: '2',
      name: 'Squats',
      duration: 15,
      calories: 150,
      difficulty: 'hard',
      created_by: 'user-1',
      created_at: new Date().toISOString(),
      met_value: 6
    }
  ];

  beforeEach(async () => {
    dataSubject = new BehaviorSubject<Exercise[]>(mockExercises);
    totalCountSubject = new BehaviorSubject<number>(mockExercises.length);

    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'loadExercises',
      'searchExercises',
      'deleteExercise'
    ], {
      data$: dataSubject.asObservable(),
      totalCount$: totalCountSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
      ],
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

  it('should search exercises', () => {
    const searchResults = [mockExercises[0]];
    exerciseService.searchExercises.and.callFake((query, difficulty, params) => {
      dataSubject.next(searchResults);
      return EMPTY; // Return an empty observable that completes immediately
    });

    component.searchQuery = 'push';
    component.selectedDifficulty = '';
    component.onSearch();

    expect(exerciseService.searchExercises).toHaveBeenCalledWith('push', '', { page: 1, perPage: 6 });
    expect(component.exercises).toEqual(searchResults);
  });

  it('should delete exercise after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    exerciseService.deleteExercise.and.returnValue(EMPTY);

    component.deleteExercise('1');

    expect(exerciseService.deleteExercise).toHaveBeenCalledWith('1');
  });

  it('should not delete exercise if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteExercise('1');

    expect(exerciseService.deleteExercise).not.toHaveBeenCalled();
  });
});