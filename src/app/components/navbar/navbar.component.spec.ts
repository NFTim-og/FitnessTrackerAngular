import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { SupabaseService } from '../../services/supabase.service';
import { BehaviorSubject } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let supabaseService: jasmine.SpyObj<SupabaseService>;
  let userSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject<any>(null);
    const supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', ['signOut'], {
      user$: userSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: SupabaseService, useValue: supabaseServiceSpy }
      ]
    }).compileComponents();

    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show auth links when user is not logged in', () => {
    userSubject.next(null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/auth/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/auth/register"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/exercises"]')).toBeFalsy();
  });

  it('should show app links when user is logged in', () => {
    userSubject.next({ id: '1', email: 'test@example.com' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/exercises"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/workout-plans"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/auth/login"]')).toBeFalsy();
  });

  it('should call signOut when sign out button is clicked', async () => {
    userSubject.next({ id: '1', email: 'test@example.com' });
    fixture.detectChanges();

    supabaseService.signOut.and.returnValue(Promise.resolve());

    const compiled = fixture.nativeElement as HTMLElement;
    const signOutButton = compiled.querySelector('button') as HTMLButtonElement;
    signOutButton.click();

    expect(supabaseService.signOut).toHaveBeenCalled();
  });
});