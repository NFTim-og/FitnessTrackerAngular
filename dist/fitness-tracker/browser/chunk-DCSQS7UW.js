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
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-TOUTZUUN.js";

// src/app/models/user-profile.model.ts
var UserProfile = class {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.weight_kg = data.weight_kg;
    this.height_cm = data.height_cm;
    this.created_at = new Date(data.created_at);
    this.updated_at = new Date(data.updated_at);
  }
  get bmi() {
    if (!this.weight_kg || !this.height_cm)
      return null;
    const heightInMeters = this.height_cm / 100;
    return this.weight_kg / (heightInMeters * heightInMeters);
  }
  get bmiCategory() {
    const bmi = this.bmi;
    if (!bmi)
      return "Unknown";
    if (bmi < 18.5)
      return "Underweight";
    if (bmi < 25)
      return "Normal weight";
    if (bmi < 30)
      return "Overweight";
    return "Obese";
  }
};
var WeightRecord = class {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.weight_kg = data.weight_kg;
    this.recorded_at = new Date(data.recorded_at);
  }
};

// src/app/services/user-profile.service.ts
var UserProfileService = class _UserProfileService {
  constructor(http, errorHandler) {
    this.http = http;
    this.errorHandler = errorHandler;
    this.apiUrl = `${environment.apiUrl}/profile`;
    this.profileSubject = new BehaviorSubject(null);
    this.weightHistorySubject = new BehaviorSubject([]);
    this.totalWeightRecordsSubject = new BehaviorSubject(0);
    this.profile$ = this.profileSubject.asObservable();
    this.weightHistory$ = this.weightHistorySubject.asObservable();
    this.totalWeightRecords$ = this.totalWeightRecordsSubject.asObservable();
    this.loadProfile();
  }
  loadProfile() {
    this.getProfile().subscribe({
      error: (error) => {
        this.profileSubject.next(null);
        this.errorHandler.handleError(error, "UserProfileService.loadProfile");
      }
    });
  }
  getProfile() {
    console.log("UserProfileService - Getting profile from:", `${this.apiUrl}`);
    return this.http.get(`${this.apiUrl}`).pipe(map((response) => {
      console.log("UserProfileService - Profile response:", response);
      const profile = new UserProfile(response.data.profile);
      this.profileSubject.next(profile);
      return profile;
    }), catchError((error) => {
      console.error("UserProfileService - Error getting profile:", error);
      return throwError(() => this.errorHandler.handleError(error, "UserProfileService.getProfile"));
    }));
  }
  updateProfile(weight_kg, height_cm) {
    return this.http.put(`${this.apiUrl}`, { weight_kg, height_cm }).pipe(map((response) => {
      const profile = new UserProfile(response.data.profile);
      this.profileSubject.next(profile);
      return profile;
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "UserProfileService.updateProfile"));
    }));
  }
  createProfile(weight_kg, height_cm) {
    return this.http.post(`${this.apiUrl}`, { weight_kg, height_cm }).pipe(map((response) => {
      const profile = new UserProfile(response.data.profile);
      this.profileSubject.next(profile);
      return profile;
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "UserProfileService.createProfile"));
    }));
  }
  getWeightHistory(params) {
    const httpParams = new HttpParams().set("page", params.page.toString()).set("limit", params.perPage.toString()).set("sortOrder", params.sortOrder || "DESC");
    return this.http.get(`${this.apiUrl}/weight`, { params: httpParams }).pipe(map((response) => {
      const weightHistory = response.data.weightHistory.map((w) => new WeightRecord(w));
      this.weightHistorySubject.next(weightHistory);
      this.totalWeightRecordsSubject.next(response.data.pagination.total);
    }), catchError((error) => {
      this.weightHistorySubject.next([]);
      this.totalWeightRecordsSubject.next(0);
      return throwError(() => this.errorHandler.handleError(error, "UserProfileService.getWeightHistory"));
    }));
  }
  recordWeight(weight_kg) {
    return this.http.post(`${this.apiUrl}/weight`, { weight_kg }).pipe(map((response) => {
      this.getWeightHistory({ page: 1, perPage: 10 }).subscribe();
      return new WeightRecord(response.data.weightRecord);
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "UserProfileService.recordWeight"));
    }));
  }
  deleteWeightRecord(id) {
    return this.http.delete(`${this.apiUrl}/weight/${id}`).pipe(map(() => {
      this.getWeightHistory({ page: 1, perPage: 10 }).subscribe();
    }), catchError((error) => {
      return throwError(() => this.errorHandler.handleError(error, "UserProfileService.deleteWeightRecord"));
    }));
  }
  calculateCalories(metValue, durationMinutes) {
    const profile = this.profileSubject.value;
    if (!profile || !profile.weight_kg)
      return 0;
    const durationHours = durationMinutes / 60;
    return Math.round(metValue * profile.weight_kg * durationHours);
  }
  static {
    this.\u0275fac = function UserProfileService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _UserProfileService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(ErrorHandlerService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserProfileService, factory: _UserProfileService.\u0275fac, providedIn: "root" });
  }
};

export {
  UserProfileService
};
//# sourceMappingURL=chunk-DCSQS7UW.js.map
