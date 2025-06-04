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
  catchError,
  map,
  of,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-TOUTZUUN.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/models/workout-plan.model.ts
var WorkoutExercise = class _WorkoutExercise {
  constructor(data = {}) {
    this.id = "";
    this.workout_plan_id = "";
    this.exercise_id = "";
    this.order = 0;
    this.id = data.id || "";
    this.workout_plan_id = data.workout_plan_id || "";
    this.exercise_id = data.exercise_id || "";
    this.order = data.order || 0;
    this.exercise = data.exercise ? new Exercise(data.exercise) : void 0;
  }
  static fromJSON(json) {
    return new _WorkoutExercise(__spreadProps(__spreadValues({}, json), {
      exercise: json.exercise ? Exercise.fromJSON(json.exercise) : void 0
    }));
  }
};
var WorkoutPlan = class _WorkoutPlan {
  constructor(data = {}) {
    this.id = "";
    this.name = "";
    this.description = "";
    this.created_by = "";
    this.created_at = (/* @__PURE__ */ new Date()).toISOString();
    this.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.id = data.id || "";
    this.name = data.name || "";
    this.description = data.description || "";
    this.created_by = data.created_by || "";
    this.created_at = data.created_at || (/* @__PURE__ */ new Date()).toISOString();
    this.updated_at = data.updated_at || (/* @__PURE__ */ new Date()).toISOString();
    this.exercises = data.exercises?.map((e) => new WorkoutExercise(e));
  }
  static fromJSON(json) {
    return new _WorkoutPlan(__spreadProps(__spreadValues({}, json), {
      exercises: json.exercises?.map((e) => WorkoutExercise.fromJSON(e))
    }));
  }
  toJSON() {
    return {
      name: this.name,
      description: this.description
    };
  }
  getExercises() {
    return this.exercises?.filter((we) => we.exercise).map((we) => we.exercise).sort((a, b) => a.name.localeCompare(b.name)) || [];
  }
};

// src/app/services/workout-plan.service.ts
var WorkoutPlanService = class _WorkoutPlanService {
  constructor(http, errorHandler) {
    this.http = http;
    this.errorHandler = errorHandler;
    this.apiUrl = `${environment.apiUrl}/workout-plans`;
    this.workoutPlansSubject = new BehaviorSubject([]);
    this.totalCountSubject = new BehaviorSubject(0);
    this.currentParams = { page: 1, perPage: 1 };
    this.workoutPlans$ = this.workoutPlansSubject.asObservable();
    this.totalCount$ = this.totalCountSubject.asObservable();
  }
  loadWorkoutPlans(params) {
    this.currentParams = params;
    const httpParams = new HttpParams().set("page", params.page.toString()).set("limit", params.perPage.toString()).set("sortBy", params.sortBy || "name").set("sortOrder", params.sortOrder || "ASC");
    console.log("WorkoutPlanService - Loading workout plans from:", `${this.apiUrl}`);
    console.log("WorkoutPlanService - With params:", params);
    console.log("WorkoutPlanService - Using hardcoded dummy data");
    const dummyWorkoutPlans = [
      WorkoutPlan.fromJSON({
        id: "00000000-0000-0000-0000-000000000001",
        name: "Full Body Workout",
        description: "A complete workout targeting all major muscle groups",
        created_by: "00000000-0000-0000-0000-000000000099",
        exercises: [
          {
            id: "00000000-0000-0000-0000-000000000101",
            workout_plan_id: "00000000-0000-0000-0000-000000000001",
            exercise_id: "00000000-0000-0000-0000-000000000001",
            order: 1,
            exercise: {
              id: "00000000-0000-0000-0000-000000000001",
              name: "Push-ups",
              duration: 10,
              calories: 100,
              difficulty: "medium",
              met_value: 3.8,
              created_by: "00000000-0000-0000-0000-000000000099"
            }
          },
          {
            id: "00000000-0000-0000-0000-000000000102",
            workout_plan_id: "00000000-0000-0000-0000-000000000001",
            exercise_id: "00000000-0000-0000-0000-000000000002",
            order: 2,
            exercise: {
              id: "00000000-0000-0000-0000-000000000002",
              name: "Sit-ups",
              duration: 10,
              calories: 80,
              difficulty: "easy",
              met_value: 3,
              created_by: "00000000-0000-0000-0000-000000000099"
            }
          }
        ]
      }),
      WorkoutPlan.fromJSON({
        id: "00000000-0000-0000-0000-000000000002",
        name: "Upper Body Strength",
        description: "Focus on building upper body strength",
        created_by: "00000000-0000-0000-0000-000000000099",
        exercises: [
          {
            id: "00000000-0000-0000-0000-000000000201",
            workout_plan_id: "00000000-0000-0000-0000-000000000002",
            exercise_id: "00000000-0000-0000-0000-000000000001",
            order: 1,
            exercise: {
              id: "00000000-0000-0000-0000-000000000001",
              name: "Push-ups",
              duration: 10,
              calories: 100,
              difficulty: "medium",
              met_value: 3.8,
              created_by: "00000000-0000-0000-0000-000000000099"
            }
          }
        ]
      }),
      WorkoutPlan.fromJSON({
        id: "00000000-0000-0000-0000-000000000003",
        name: "Core Strength",
        description: "Focus on building core strength",
        created_by: "00000000-0000-0000-0000-000000000099",
        exercises: [
          {
            id: "00000000-0000-0000-0000-000000000301",
            workout_plan_id: "00000000-0000-0000-0000-000000000003",
            exercise_id: "00000000-0000-0000-0000-000000000002",
            order: 1,
            exercise: {
              id: "00000000-0000-0000-0000-000000000002",
              name: "Sit-ups",
              duration: 10,
              calories: 80,
              difficulty: "easy",
              met_value: 3,
              created_by: "00000000-0000-0000-0000-000000000099"
            }
          },
          {
            id: "00000000-0000-0000-0000-000000000302",
            workout_plan_id: "00000000-0000-0000-0000-000000000003",
            exercise_id: "00000000-0000-0000-0000-000000000005",
            order: 2,
            exercise: {
              id: "00000000-0000-0000-0000-000000000005",
              name: "Plank",
              duration: 5,
              calories: 50,
              difficulty: "hard",
              met_value: 4,
              created_by: "00000000-0000-0000-0000-000000000099"
            }
          }
        ]
      })
    ];
    console.log("WorkoutPlanService - Dummy workout plans:", dummyWorkoutPlans);
    this.workoutPlansSubject.next(dummyWorkoutPlans);
    this.totalCountSubject.next(dummyWorkoutPlans.length);
    return of(void 0).pipe(map(() => {
    }), catchError((error) => {
      console.error("WorkoutPlanService - Error loading workout plans:", error);
      this.workoutPlansSubject.next([]);
      this.totalCountSubject.next(0);
      return throwError(() => this.errorHandler.handleError(error, "WorkoutPlanService.loadWorkoutPlans", true));
    }));
  }
  getWorkoutPlan(id) {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(map((response) => WorkoutPlan.fromJSON(response.data.workoutPlan)), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "WorkoutPlanService.getWorkoutPlan", true));
    }));
  }
  createWorkoutPlan(workoutPlan, exercises) {
    const payload = {
      name: workoutPlan.name,
      description: workoutPlan.description,
      exercises
    };
    return this.http.post(`${this.apiUrl}`, payload).pipe(map((response) => {
      this.loadWorkoutPlans(this.currentParams).subscribe();
      return WorkoutPlan.fromJSON(response.data.workoutPlan);
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "WorkoutPlanService.createWorkoutPlan", true));
    }));
  }
  updateWorkoutPlan(id, workoutPlan, exercises) {
    const payload = {};
    if (workoutPlan.name) {
      payload.name = workoutPlan.name;
    }
    if (workoutPlan.description !== void 0) {
      payload.description = workoutPlan.description;
    }
    if (exercises) {
      payload.exercises = exercises;
    }
    return this.http.put(`${this.apiUrl}/${id}`, payload).pipe(map((response) => {
      this.loadWorkoutPlans(this.currentParams).subscribe();
      return WorkoutPlan.fromJSON(response.data.workoutPlan);
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "WorkoutPlanService.updateWorkoutPlan", true));
    }));
  }
  deleteWorkoutPlan(id) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(map(() => {
      this.loadWorkoutPlans(this.currentParams).subscribe();
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "WorkoutPlanService.deleteWorkoutPlan", true));
    }));
  }
  searchWorkoutPlans(query, params) {
    this.currentParams = params;
    const httpParams = new HttpParams().set("page", params.page.toString()).set("limit", params.perPage.toString()).set("sortBy", params.sortBy || "name").set("sortOrder", params.sortOrder || "ASC").set("search", query);
    return this.http.get(`${this.apiUrl}`, { params: httpParams }).pipe(map((response) => {
      const workoutPlans = response.data.workoutPlans.map((wp) => WorkoutPlan.fromJSON(wp));
      this.workoutPlansSubject.next(workoutPlans);
      this.totalCountSubject.next(response.data.pagination.total);
    }), catchError((error) => {
      this.workoutPlansSubject.next([]);
      this.totalCountSubject.next(0);
      return throwError(() => this.errorHandler.handleError(error, "WorkoutPlanService.searchWorkoutPlans", true));
    }));
  }
  static {
    this.\u0275fac = function WorkoutPlanService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WorkoutPlanService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(ErrorHandlerService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WorkoutPlanService, factory: _WorkoutPlanService.\u0275fac, providedIn: "root" });
  }
};

export {
  WorkoutPlanService
};
//# sourceMappingURL=chunk-MLD7RI2K.js.map
