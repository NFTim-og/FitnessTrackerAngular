import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../services/theme.service';
import { By } from '@angular/platform-browser';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
      providers: [ThemeService]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current theme mode', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Switch to dark mode');
    
    themeService.toggleTheme();
    fixture.detectChanges();
    
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Switch to light mode');
  });

  it('should toggle theme when clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    const spy = spyOn(themeService, 'toggleTheme');
    
    button.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});