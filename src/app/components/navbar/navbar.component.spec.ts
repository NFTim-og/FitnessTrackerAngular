import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { SupabaseService } from '../../services/supabase.service';
import { BehaviorSubject } from 'rxjs';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

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
      // Import standalone components here
      imports: [RouterTestingModule, ThemeToggleComponent, NavbarComponent],
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

  it('should call signOut when sign out button is clicked', async () => {
    // Arrange: Emit a user object to simulate a logged-in user
    userSubject.next({ id: '1', email: 'test@example.com' });
    fixture.detectChanges(); // Trigger change detection to update the DOM

    // Mock the signOut method to return a resolved promise
    supabaseService.signOut.and.returnValue(Promise.resolve());

    // Act: Find the sign-out button and click it
    const compiled = fixture.nativeElement as HTMLElement;
    const signOutButton = compiled.querySelector('.sign-out-btn') as HTMLButtonElement;
    await signOutButton.click(); // Wait for the click to complete

    // Assert: Verify that signOut was called
    expect(supabaseService.signOut).toHaveBeenCalled();
  });
});