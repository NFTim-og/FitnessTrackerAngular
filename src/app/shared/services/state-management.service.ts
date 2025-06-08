import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

/**
 * Application State Interface
 * Defines the structure of the global application state
 */
export interface AppState {
  user: {
    currentUser: any | null;
    isAuthenticated: boolean;
    profile: any | null;
  };
  exercises: {
    items: any[];
    totalCount: number;
    loading: boolean;
    error: string | null;
    filters: {
      search: string;
      difficulty: string;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    };
    pagination: {
      currentPage: number;
      perPage: number;
    };
  };
  workoutPlans: {
    items: any[];
    totalCount: number;
    loading: boolean;
    error: string | null;
    filters: {
      search: string;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    };
    pagination: {
      currentPage: number;
      perPage: number;
    };
  };
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    notifications: any[];
    loading: {
      global: boolean;
      operations: { [key: string]: boolean };
    };
  };
}

/**
 * Initial Application State
 */
const initialState: AppState = {
  user: {
    currentUser: null,
    isAuthenticated: false,
    profile: null
  },
  exercises: {
    items: [],
    totalCount: 0,
    loading: false,
    error: null,
    filters: {
      search: '',
      difficulty: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    },
    pagination: {
      currentPage: 1,
      perPage: 6
    }
  },
  workoutPlans: {
    items: [],
    totalCount: 0,
    loading: false,
    error: null,
    filters: {
      search: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    },
    pagination: {
      currentPage: 1,
      perPage: 6
    }
  },
  ui: {
    theme: 'light',
    sidebarOpen: false,
    notifications: [],
    loading: {
      global: false,
      operations: {}
    }
  }
};

/**
 * State Management Service
 * Provides centralized state management for the application
 */
@Injectable({
  providedIn: 'root'
})
export class StateManagementService {
  private stateSubject = new BehaviorSubject<AppState>(initialState);
  
  // Main state observable
  state$ = this.stateSubject.asObservable();

  // Selectors for different parts of the state
  user$ = this.state$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );

  exercises$ = this.state$.pipe(
    map(state => state.exercises),
    distinctUntilChanged()
  );

  workoutPlans$ = this.state$.pipe(
    map(state => state.workoutPlans),
    distinctUntilChanged()
  );

  ui$ = this.state$.pipe(
    map(state => state.ui),
    distinctUntilChanged()
  );

  // Specific selectors
  isAuthenticated$ = this.user$.pipe(
    map(user => user.isAuthenticated),
    distinctUntilChanged()
  );

  currentUser$ = this.user$.pipe(
    map(user => user.currentUser),
    distinctUntilChanged()
  );

  exerciseItems$ = this.exercises$.pipe(
    map(exercises => exercises.items),
    distinctUntilChanged()
  );

  exerciseLoading$ = this.exercises$.pipe(
    map(exercises => exercises.loading),
    distinctUntilChanged()
  );

  workoutPlanItems$ = this.workoutPlans$.pipe(
    map(workoutPlans => workoutPlans.items),
    distinctUntilChanged()
  );

  theme$ = this.ui$.pipe(
    map(ui => ui.theme),
    distinctUntilChanged()
  );

  notifications$ = this.ui$.pipe(
    map(ui => ui.notifications),
    distinctUntilChanged()
  );

  /**
   * Get current state snapshot
   */
  getCurrentState(): AppState {
    return this.stateSubject.value;
  }

  /**
   * Update state with partial state object
   */
  updateState(partialState: Partial<AppState>): void {
    const currentState = this.getCurrentState();
    const newState = this.deepMerge(currentState, partialState);
    this.stateSubject.next(newState);
  }

  /**
   * Update user state
   */
  updateUserState(userState: Partial<AppState['user']>): void {
    this.updateState({
      user: { ...this.getCurrentState().user, ...userState }
    });
  }

  /**
   * Update exercises state
   */
  updateExercisesState(exercisesState: Partial<AppState['exercises']>): void {
    this.updateState({
      exercises: { ...this.getCurrentState().exercises, ...exercisesState }
    });
  }

  /**
   * Update workout plans state
   */
  updateWorkoutPlansState(workoutPlansState: Partial<AppState['workoutPlans']>): void {
    this.updateState({
      workoutPlans: { ...this.getCurrentState().workoutPlans, ...workoutPlansState }
    });
  }

  /**
   * Update UI state
   */
  updateUIState(uiState: Partial<AppState['ui']>): void {
    this.updateState({
      ui: { ...this.getCurrentState().ui, ...uiState }
    });
  }

  /**
   * Reset state to initial values
   */
  resetState(): void {
    this.stateSubject.next(initialState);
  }

  /**
   * Reset specific section of state
   */
  resetExercisesState(): void {
    this.updateExercisesState(initialState.exercises);
  }

  resetWorkoutPlansState(): void {
    this.updateWorkoutPlansState(initialState.workoutPlans);
  }

  /**
   * Deep merge utility for nested objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Persist state to localStorage
   */
  persistState(): void {
    try {
      const state = this.getCurrentState();
      // Only persist certain parts of the state
      const persistableState = {
        user: {
          profile: state.user.profile
        },
        exercises: {
          filters: state.exercises.filters,
          pagination: state.exercises.pagination
        },
        workoutPlans: {
          filters: state.workoutPlans.filters,
          pagination: state.workoutPlans.pagination
        },
        ui: {
          theme: state.ui.theme,
          sidebarOpen: state.ui.sidebarOpen
        }
      };
      
      localStorage.setItem('fitnessTrackerState', JSON.stringify(persistableState));
    } catch (error) {
      console.warn('Failed to persist state to localStorage:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  loadPersistedState(): void {
    try {
      const persistedState = localStorage.getItem('fitnessTrackerState');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        this.updateState(parsedState);
      }
    } catch (error) {
      console.warn('Failed to load persisted state from localStorage:', error);
    }
  }
}
