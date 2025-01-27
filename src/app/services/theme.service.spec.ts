import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    // Clear localStorage before each test
    localStorage.clear();
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
    service.darkMode$.subscribe(isDark => {
      expect(isDark).toBeTrue();
      done();
    });
    service.toggleTheme();
  });
});