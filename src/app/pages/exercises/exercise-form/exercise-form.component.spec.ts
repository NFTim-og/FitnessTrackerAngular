import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ExerciseFormComponent } from './exercise-form.component';
import { ExerciseService } from '../../../services/exercise.service';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;
  let router: Router;

  const mockExercise = {
    id: '1',
    name: 'Push-ups',
    duration: 10,
    calories: 100,
    difficulty: 'medium' as const,
    created_by: 'user-1',
    created_at: new Date().toISOString()
  };

  beforeEach(async () => {
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'getExercise',
      'createExercise',
      'updateExercise'
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ExerciseService, useValue: exerciseServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.exerciseForm.value).toEqual({
      name: '',
      duration: '',
      calories: '',
      difficulty: ''
    });
  });

  it('should validate required fields', () => {
    expect(component.exerciseForm.valid).toBeFalse();
    component.exerciseForm.patchValue({
      name: 'Push-ups',
      duration: 10,
      calories: 100,
      difficulty: 'medium'
    });
    expect(component.exerciseForm.valid).toBeTrue();
  });

  it('should load exercise data when editing', async () => {
    exerciseService.getExercise.and.returnValue(Promise.resolve(mockExercise));
    
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ExerciseService, useValue: exerciseService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
    expect(component.exerciseForm.value).toEqual({
      name: mockExercise.name,
      duration: mockExercise.duration,
      calories: mockExercise.calories,
      difficulty: mockExercise.difficulty
    });
  });

  it('should create new exercise', async () => {
    const newExercise = {
      name: 'Squats',
      duration: 15,
      calories: 150,
      difficulty: 'hard' as const
    };

    exerciseService.createExercise.and.returnValue(Promise.resolve({ ...newExercise, id: '2' }));
    spyOn(router, 'navigate');

    component.exerciseForm.patchValue(newExercise);
    await component.onSubmit();

    expect(exerciseService.createExercise).toHaveBeenCalledWith(newExercise);
    expect(router.navigate).toHaveBeenCalledWith(['/exercises']);
  });
});