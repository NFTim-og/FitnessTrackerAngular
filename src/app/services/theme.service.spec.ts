import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.isDarkMode()).toBeFalse();
  });

  it('should toggle theme', () => {
    expect(service.isDarkMode()).toBeFalse();
    service.toggleTheme();
    expect(service.isDarkMode()).toBeTrue();
    service.toggleTheme();
    expect(service.isDarkMode()).toBeFalse();
  });

  it('should persist theme preference', () => {
    service.toggleTheme(); // Enable dark mode
    expect(localStorage.getItem('darkMode')).toBe('true');
    
    // Create new instance to test persistence
    const newService = TestBed.inject(ThemeService);
    expect(newService.isDarkMode()).toBeTrue();
  });

  it('should notify subscribers when theme changes', (done) => {
    let callCount = 0;
    service.darkMode$.subscribe(isDark => {
      if (callCount === 0) {
        expect(isDark).toBeFalse(); // Initial value
      } else {
        expect(isDark).toBeTrue(); // After toggle
        done();
      }
      callCount++;
    });
    service.toggleTheme();
  });
});
