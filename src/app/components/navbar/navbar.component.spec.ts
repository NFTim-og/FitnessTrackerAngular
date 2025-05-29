import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { User } from '../../models/user.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject<User | null>(null);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      user$: userSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      // Import standalone components here
      imports: [RouterTestingModule, ThemeToggleComponent, NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout when sign out button is clicked', async () => {
    // Arrange: Emit a user object to simulate a logged-in user
    userSubject.next(new User({ id: '1', email: 'test@example.com' }));
    fixture.detectChanges(); // Trigger change detection to update the DOM

    // Act: Find the sign-out button and click it
    const compiled = fixture.nativeElement as HTMLElement;
    const signOutButton = compiled.querySelector('button.nav-link') as HTMLButtonElement;

    // Ensure the button is present
    expect(signOutButton).toBeTruthy('Sign out button should be present in the DOM');

    await signOutButton.click(); // Wait for the click to complete

    // Assert: Verify that logout was called
    expect(authService.logout).toHaveBeenCalled();
  });
});