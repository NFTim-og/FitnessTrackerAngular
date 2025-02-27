import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ExerciseFormComponent } from './exercise-form.component';
import { ExerciseService } from '../../../services/exercise.service';
import { UserProfileService } from '../../../services/user-profile.service';
import { Exercise } from '../../../models/exercise.model';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
  let router: Router;
  let profileSubject: Subject<any>;

  const mockExercise = {
    id: '1',
    name: 'Push-ups',
    duration: 10,
    calories: 100,
    difficulty: 'medium' as const,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    met_value: 4
  };

  beforeEach(async () => {
    profileSubject = new Subject<any>();
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', 
      ['getExercise', 'createExercise', 'updateExercise']);
    
    const userProfileServiceSpy = jasmine.createSpyObj('UserProfileService', 
      ['calculateCalories'], 
      { profile$: profileSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ExerciseService, useValue: exerciseServiceSpy },
        { provide: UserProfileService, useValue: userProfileServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    userProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
    router = TestBed.inject(Router);
    
    userProfileService.calculateCalories.and.returnValue(100);
    profileSubject.next({ weight: 70 }); // Initial profile data
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.exerciseForm.value).toEqual({
      name: '',
      duration: '',
      met_value: 4,
      difficulty: ''
    });
  });

  it('should validate required fields', () => {
    expect(component.exerciseForm.valid).toBeFalse();
    
    component.exerciseForm.patchValue({
      name: 'Test Exercise',
      duration: 10,
      met_value: 3,
      difficulty: 'easy'
    });
    
    expect(component.exerciseForm.valid).toBeTrue();
  });

  it('should show error messages for invalid fields', () => {
    const nameControl = component.exerciseForm.get('name');
    nameControl?.markAsTouched();
    fixture.detectChanges();
    
    const errorMessage = fixture.nativeElement.querySelector('.text-red-500');
    expect(errorMessage.textContent).toContain('Exercise name is required');
  });

  it('should load exercise data when editing', fakeAsync(() => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.params as any) = { id: '1' };
    
    exerciseService.getExercise.and.returnValue(Promise.resolve(mockExercise));
    
    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    
    expect(component.isEditing).toBeTrue();
    expect(component.exerciseForm.value).toEqual({
      name: mockExercise.name,
      duration: mockExercise.duration,
      met_value: mockExercise.met_value,
      difficulty: mockExercise.difficulty
    });
  }));

  it('should calculate calories when duration or MET changes', fakeAsync(() => {
    userProfileService.calculateCalories.and.returnValue(100);
    profileSubject.next({ weight: 70 });
    fixture.detectChanges();
  
    component.exerciseForm.patchValue({ 
      name: 'Test',
      duration: 30, 
      met_value: 5,
      difficulty: 'medium'
    }, { emitEvent: true });
  
    // If using debounce, adjust the tick time (e.g., 300ms)
    tick(300);
    fixture.detectChanges();
  
    expect(userProfileService.calculateCalories).toHaveBeenCalledWith(5, 30);
    expect(component.estimatedCalories).toBe(100);
  }));

  it('should update calories when profile changes', fakeAsync(() => {
    userProfileService.calculateCalories.and.returnValue(100);
    
    // Set initial values
    component.exerciseForm.patchValue({ 
      name: 'Test',
      duration: 20, 
      met_value: 4,
      difficulty: 'medium'
    }, { emitEvent: true });
    tick(100);
    fixture.detectChanges();
    
    // Trigger profile change
    profileSubject.next({ weight: 75 });
    tick(100);
    fixture.detectChanges();
    
    expect(userProfileService.calculateCalories).toHaveBeenCalledTimes(3);
  }));

  it('should create new exercise', fakeAsync(() => {
    userProfileService.calculateCalories.and.returnValue(100);
    profileSubject.next({ weight: 70 }); // Ensure profile is set
    tick();
    
    const formData = {
      name: 'Squats',
      duration: 15,
      met_value: 5,
      difficulty: 'hard' as const,
      calories: 100
    };

    component.exerciseForm.patchValue({
      name: formData.name,
      duration: formData.duration,
      met_value: formData.met_value,
      difficulty: formData.difficulty
    }, { emitEvent: true });
    tick(100);
    fixture.detectChanges();

    exerciseService.createExercise.and.returnValue(Promise.resolve({ ...formData, id: '2' }));
    spyOn(router, 'navigate');

    component.onSubmit();
    tick();

    expect(exerciseService.createExercise).toHaveBeenCalledWith(jasmine.objectContaining(formData));
    expect(router.navigate).toHaveBeenCalledWith(['/exercises']);
  }));

  it('should update existing exercise', fakeAsync(async () => {
    const route = TestBed.inject(ActivatedRoute);
    (route.snapshot.params as any) = { id: '1' };
    exerciseService.getExercise.and.returnValue(Promise.resolve(mockExercise));
    
    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    const updatedExercise = {
      name: 'Push-ups',
      duration: 20,
      met_value: 4,
      difficulty: 'medium' as const,
      calories: 100
    };

    component.exerciseForm.patchValue(updatedExercise);
    exerciseService.updateExercise.and.returnValue(Promise.resolve({}));
    spyOn(router, 'navigate');

    await component.onSubmit();

    expect(exerciseService.updateExercise).toHaveBeenCalledWith('1', updatedExercise);
    expect(router.navigate).toHaveBeenCalledWith(['/exercises']);
  }));

  it('should navigate back on cancel', () => {
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/exercises']);
  });

  it('should unsubscribe on destroy', () => {
    const subscription = component['profileSubscription'];
    spyOn(subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});