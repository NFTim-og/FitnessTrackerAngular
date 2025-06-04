import {
  Exercise
} from "./chunk-GRRRYM6Y.js";
import {
  ErrorHandlerService
} from "./chunk-AQ6Y7BDJ.js";
import {
  environment
} from "./chunk-NLRHYWXW.js";
import {
  BehaviorSubject,
  HttpClient,
  HttpParams,
  Observable,
  catchError,
  finalize,
  map,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-TOUTZUUN.js";
import {
  __async,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/shared/services/loading.service.ts
var LoadingService = class _LoadingService {
  constructor() {
    this.loadingSubject = new BehaviorSubject({});
    this.loading$ = this.loadingSubject.asObservable();
  }
  /**
   * Set loading state for a specific operation
   * @param operation - Unique identifier for the operation
   * @param isLoading - Whether the operation is loading
   */
  setLoading(operation, isLoading) {
    const currentState = this.loadingSubject.value;
    const newState = __spreadValues({}, currentState);
    if (isLoading) {
      newState[operation] = true;
    } else {
      delete newState[operation];
    }
    this.loadingSubject.next(newState);
  }
  /**
   * Check if a specific operation is loading
   * @param operation - Operation identifier
   * @returns True if the operation is loading
   */
  isLoading(operation) {
    return new Observable((observer) => {
      this.loading$.subscribe((state) => {
        observer.next(!!state[operation]);
      });
    });
  }
  /**
   * Check if any operation is loading
   * @returns True if any operation is loading
   */
  isAnyLoading() {
    return new Observable((observer) => {
      this.loading$.subscribe((state) => {
        observer.next(Object.keys(state).length > 0);
      });
    });
  }
  /**
   * Get all current loading operations
   * @returns Array of operation names that are currently loading
   */
  getLoadingOperations() {
    return new Observable((observer) => {
      this.loading$.subscribe((state) => {
        observer.next(Object.keys(state));
      });
    });
  }
  /**
   * Clear all loading states
   */
  clearAll() {
    this.loadingSubject.next({});
  }
  /**
   * Start loading for an operation
   * @param operation - Operation identifier
   */
  start(operation) {
    this.setLoading(operation, true);
  }
  /**
   * Stop loading for an operation
   * @param operation - Operation identifier
   */
  stop(operation) {
    this.setLoading(operation, false);
  }
  /**
   * Execute an operation with automatic loading state management
   * @param operation - Operation identifier
   * @param task - Promise or Observable to execute
   * @returns Promise that resolves when the task completes
   */
  withLoading(operation, task) {
    return __async(this, null, function* () {
      try {
        this.start(operation);
        const result = yield task;
        return result;
      } finally {
        this.stop(operation);
      }
    });
  }
  /**
   * Execute an Observable operation with automatic loading state management
   * @param operation - Operation identifier
   * @param task - Observable to execute
   * @returns Observable that manages loading state
   */
  withLoadingObservable(operation, task) {
    return new Observable((observer) => {
      this.start(operation);
      const subscription = task.subscribe({
        next: (value) => observer.next(value),
        error: (error) => {
          this.stop(operation);
          observer.error(error);
        },
        complete: () => {
          this.stop(operation);
          observer.complete();
        }
      });
      return () => {
        this.stop(operation);
        subscription.unsubscribe();
      };
    });
  }
  static {
    this.\u0275fac = function LoadingService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoadingService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LoadingService, factory: _LoadingService.\u0275fac, providedIn: "root" });
  }
};

// src/app/services/exercise.service.ts
var ExerciseService = class _ExerciseService {
  /**
   * Constructor
   * @param http - Angular HTTP client for making API requests
   * @param errorHandler - Service for handling and formatting errors
   */
  constructor(http, errorHandler, loadingService) {
    this.http = http;
    this.errorHandler = errorHandler;
    this.loadingService = loadingService;
    this.apiUrl = `${environment.apiUrl}/exercises`;
    this.exercisesSubject = new BehaviorSubject([]);
    this.totalCountSubject = new BehaviorSubject(0);
    this.exercises$ = this.exercisesSubject.asObservable();
    this.totalCount$ = this.totalCountSubject.asObservable();
    this.data$ = this.exercises$;
  }
  /**
   * Load exercises with pagination, sorting and filtering
   * Uses Angular HttpClient for consistent API communication
   *
   * @param params - Pagination parameters (page, perPage, sortBy, sortOrder)
   * @returns Observable that completes when data is loaded
   */
  loadExercises(params) {
    const httpParams = new HttpParams().set("page", params.page.toString()).set("limit", params.perPage.toString()).set("sortBy", params.sortBy || "name").set("sortOrder", params.sortOrder || "ASC");
    console.log("ExerciseService - Loading exercises from:", `${this.apiUrl}`);
    console.log("ExerciseService - With params:", params);
    this.loadingService.start("loadExercises");
    return this.http.get(`${this.apiUrl}`, { params: httpParams }).pipe(map((response) => {
      console.log("ExerciseService - HttpClient response:", response);
      if (response && response.status === "success" && response.data && Array.isArray(response.data.exercises)) {
        const exercises = response.data.exercises.map((e) => new Exercise(e));
        console.log("ExerciseService - Parsed exercises:", exercises);
        this.exercisesSubject.next(exercises);
        if (response.data.pagination && typeof response.data.pagination.total === "number") {
          this.totalCountSubject.next(response.data.pagination.total);
        } else {
          this.totalCountSubject.next(exercises.length);
        }
      }
    }), catchError((error) => {
      console.error("ExerciseService - Error loading exercises:", error);
      return throwError(() => this.errorHandler.handleError(error, "ExerciseService.loadExercises", true));
    }), finalize(() => {
      this.loadingService.stop("loadExercises");
    }));
  }
  /**
   * Get a specific exercise by ID
   *
   * @param id - Exercise ID to retrieve
   * @returns Observable of Exercise object
   */
  getExercise(id) {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      // Convert API response to Exercise object
      map((response) => new Exercise(response.data.exercise)),
      // Handle and format any errors
      catchError((error) => {
        return throwError(() => this.errorHandler.handleError(error, "ExerciseService.getExercise", true));
      })
    );
  }
  /**
   * Create a new exercise
   *
   * @param exercise - Exercise data without ID, created_at, and created_by fields
   * @returns Observable of the created Exercise
   */
  createExercise(exercise) {
    console.log("ExerciseService - Creating exercise:", exercise);
    this.loadingService.start("createExercise");
    return this.http.post(`${this.apiUrl}`, exercise).pipe(
      map((response) => {
        console.log("ExerciseService - Create exercise response:", response);
        if (response && response.status === "success" && response.data && response.data.exercise) {
          const createdExercise = new Exercise(response.data.exercise);
          console.log("ExerciseService - Created exercise:", createdExercise);
          this.loadExercises({ page: 1, perPage: 6 }).subscribe({
            next: () => console.log("ExerciseService - Exercises reloaded after creation"),
            error: (err) => console.error("ExerciseService - Error reloading exercises:", err)
          });
          return createdExercise;
        } else {
          console.error("ExerciseService - Invalid create response format:", response);
          throw new Error("Failed to create exercise: Invalid response format");
        }
      }),
      // Handle and format any errors
      catchError((error) => {
        console.error("ExerciseService - Error creating exercise:", error);
        return throwError(() => this.errorHandler.handleError(error, "ExerciseService.createExercise", true));
      }),
      finalize(() => {
        this.loadingService.stop("createExercise");
      })
    );
  }
  /**
   * Update an existing exercise
   *
   * @param id - ID of the exercise to update
   * @param exercise - Partial exercise data with fields to update
   * @returns Observable of the updated Exercise
   */
  updateExercise(id, exercise) {
    console.log("ExerciseService - Updating exercise:", id, exercise);
    return this.http.put(`${this.apiUrl}/${id}`, exercise).pipe(
      map((response) => {
        console.log("ExerciseService - Update exercise response:", response);
        if (response && response.status === "success" && response.data && response.data.exercise) {
          const updatedExercise = new Exercise(response.data.exercise);
          console.log("ExerciseService - Updated exercise:", updatedExercise);
          this.loadExercises({ page: 1, perPage: 6 }).subscribe({
            next: () => console.log("ExerciseService - Exercises reloaded after update"),
            error: (err) => console.error("ExerciseService - Error reloading exercises:", err)
          });
          return updatedExercise;
        } else {
          console.error("ExerciseService - Invalid update response format:", response);
          throw new Error("Failed to update exercise: Invalid response format");
        }
      }),
      // Handle and format any errors
      catchError((error) => {
        console.error("ExerciseService - Error updating exercise:", error);
        return throwError(() => this.errorHandler.handleError(error, "ExerciseService.updateExercise", true));
      })
    );
  }
  /**
   * Delete an exercise
   *
   * @param id - ID of the exercise to delete
   * @returns Observable that completes when deletion is successful
   */
  deleteExercise(id) {
    console.log("ExerciseService - Deleting exercise:", id);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        console.log("ExerciseService - Delete exercise response:", response);
        if (response && response.status === "success") {
          console.log("ExerciseService - Exercise deleted successfully");
          this.loadExercises({ page: 1, perPage: 6 }).subscribe({
            next: () => console.log("ExerciseService - Exercises reloaded after deletion"),
            error: (err) => console.error("ExerciseService - Error reloading exercises:", err)
          });
        } else {
          console.error("ExerciseService - Invalid delete response format:", response);
          throw new Error("Failed to delete exercise: Invalid response format");
        }
      }),
      // Handle and format any errors
      catchError((error) => {
        console.error("ExerciseService - Error deleting exercise:", error);
        return throwError(() => this.errorHandler.handleError(error, "ExerciseService.deleteExercise", true));
      })
    );
  }
  /**
   * Search exercises with filters
   *
   * @param query - Search term for exercise name
   * @param difficulty - Filter by difficulty level
   * @param params - Pagination parameters
   * @returns Observable that completes when search is done
   */
  searchExercises(query, difficulty, params) {
    let httpParams = new HttpParams().set("page", params.page.toString()).set("limit", params.perPage.toString()).set("sortBy", params.sortBy || "name").set("sortOrder", params.sortOrder || "ASC");
    if (query) {
      httpParams = httpParams.set("search", query);
    }
    if (difficulty) {
      httpParams = httpParams.set("difficulty", difficulty);
    }
    console.log("ExerciseService - Searching exercises with query:", query, "difficulty:", difficulty);
    console.log("ExerciseService - Search params:", httpParams.toString());
    return this.http.get(`${this.apiUrl}`, { params: httpParams }).pipe(
      map((response) => {
        console.log("ExerciseService - Search response:", response);
        if (response && response.status === "success" && response.data && Array.isArray(response.data.exercises)) {
          const exercises = response.data.exercises.map((e) => new Exercise(e));
          console.log("ExerciseService - Search found exercises:", exercises.length);
          this.exercisesSubject.next(exercises);
          if (response.data.pagination && typeof response.data.pagination.total === "number") {
            this.totalCountSubject.next(response.data.pagination.total);
          } else {
            this.totalCountSubject.next(exercises.length);
          }
        } else {
          console.error("ExerciseService - Invalid search response format:", response);
          this.exercisesSubject.next([]);
          this.totalCountSubject.next(0);
        }
      }),
      // Handle and format any errors
      catchError((error) => {
        console.error("ExerciseService - Error searching exercises:", error);
        this.exercisesSubject.next([]);
        this.totalCountSubject.next(0);
        return throwError(() => this.errorHandler.handleError(error, "ExerciseService.searchExercises"));
      })
    );
  }
  static {
    this.\u0275fac = function ExerciseService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExerciseService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(ErrorHandlerService), \u0275\u0275inject(LoadingService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _ExerciseService,
      factory: _ExerciseService.\u0275fac,
      providedIn: "root"
      // Service is provided at the root level (singleton)
    });
  }
};

export {
  LoadingService,
  ExerciseService
};
//# sourceMappingURL=chunk-JM5U7FVQ.js.map
