import {
  WorkoutPlanService
} from "./chunk-MLD7RI2K.js";
import {
  PaginationComponent
} from "./chunk-E5EQZOMU.js";
import "./chunk-GRRRYM6Y.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-FETORVPO.js";
import {
  AppError
} from "./chunk-AQ6Y7BDJ.js";
import "./chunk-NLRHYWXW.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-D7HEFMF2.js";
import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-TOUTZUUN.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/shared/models/pagination.model.ts
var PaginationState = class {
  constructor(data = {}) {
    this.currentPage = data.currentPage || 1;
    this.totalCount = data.totalCount || 0;
    this.perPage = data.perPage || 10;
  }
  get totalPages() {
    return Math.ceil(this.totalCount / this.perPage);
  }
  get startIndex() {
    return (this.currentPage - 1) * this.perPage;
  }
  get endIndex() {
    return this.startIndex + this.perPage - 1;
  }
};

// src/app/pages/workout-plans/workout-plan-list/workout-plan-list.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _c0 = () => ["/workout-plans/new"];
var _c1 = (a0) => ["/workout-plans", a0, "edit"];
function WorkoutPlanListComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 10);
    \u0275\u0275listener("click", function WorkoutPlanListComponent_Conditional_9_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.error = null);
    });
    \u0275\u0275text(3, "\xD7");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.error, " ");
  }
}
function WorkoutPlanListComponent_For_12_Conditional_7_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const exercise_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(exercise_r4.name);
  }
}
function WorkoutPlanListComponent_For_12_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "h4", 18);
    \u0275\u0275text(2, "Exercises:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 19);
    \u0275\u0275repeaterCreate(4, WorkoutPlanListComponent_For_12_Conditional_7_For_5_Template, 2, 1, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const plan_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.getExercises(plan_r5));
  }
}
function WorkoutPlanListComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 11)(2, "h3", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 13)(5, "pre", 14);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(7, WorkoutPlanListComponent_For_12_Conditional_7_Template, 6, 0, "div", 15);
    \u0275\u0275elementStart(8, "div", 16)(9, "button", 5);
    \u0275\u0275text(10, " Edit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 17);
    \u0275\u0275listener("click", function WorkoutPlanListComponent_For_12_Template_button_click_11_listener() {
      const plan_r5 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deleteWorkoutPlan(plan_r5.id));
    });
    \u0275\u0275text(12, " Delete ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const plan_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(plan_r5.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(plan_r5.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(plan_r5.exercises && plan_r5.exercises.length > 0 ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c1, plan_r5.id));
  }
}
var WorkoutPlanListComponent = class _WorkoutPlanListComponent {
  constructor(workoutPlanService) {
    this.workoutPlanService = workoutPlanService;
    this.workoutPlans = [];
    this.searchQuery = "";
    this.error = null;
    this.pagination = new PaginationState({
      currentPage: 1,
      totalCount: 0,
      perPage: 6
      // Increased from 1 to 6 to show more workout plans per page
    });
    this.workoutPlanService.totalCount$.subscribe((count) => {
      this.pagination = new PaginationState({
        currentPage: this.pagination.currentPage,
        totalCount: count,
        perPage: this.pagination.perPage
      });
    });
  }
  ngOnInit() {
    console.log("WorkoutPlanListComponent - Initializing");
    this.workoutPlanService.workoutPlans$.subscribe((plans) => {
      console.log("WorkoutPlanListComponent - Received workout plans:", plans);
      this.workoutPlans = plans;
    });
    this.loadWorkoutPlans();
  }
  loadWorkoutPlans() {
    return __async(this, null, function* () {
      console.log("WorkoutPlanListComponent - Loading workout plans");
      try {
        yield this.workoutPlanService.loadWorkoutPlans({
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        });
        console.log("WorkoutPlanListComponent - Workout plans loaded successfully");
        console.log("WorkoutPlanListComponent - Current workout plans:", this.workoutPlans);
        console.log("WorkoutPlanListComponent - Pagination:", this.pagination);
        this.error = null;
      } catch (error) {
        console.error("WorkoutPlanListComponent - Error loading workout plans:", error);
        this.error = error instanceof AppError ? error.message : "Failed to load workout plans";
      }
    });
  }
  getExercises(plan) {
    return plan.getExercises();
  }
  onSearch() {
    return __async(this, null, function* () {
      this.pagination = new PaginationState(__spreadProps(__spreadValues({}, this.pagination), {
        currentPage: 1
      }));
      try {
        yield this.workoutPlanService.searchWorkoutPlans(this.searchQuery, {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        });
      } catch (error) {
        console.error("Error searching workout plans:", error);
      }
    });
  }
  changePage(page) {
    return __async(this, null, function* () {
      this.pagination = new PaginationState(__spreadProps(__spreadValues({}, this.pagination), {
        currentPage: page
      }));
      if (this.searchQuery) {
        yield this.workoutPlanService.searchWorkoutPlans(this.searchQuery, {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        });
      } else {
        yield this.loadWorkoutPlans();
      }
    });
  }
  deleteWorkoutPlan(id) {
    return __async(this, null, function* () {
      if (!confirm("Are you sure you want to delete this workout plan?"))
        return;
      try {
        yield this.workoutPlanService.deleteWorkoutPlan(id);
        this.error = null;
      } catch (error) {
        this.error = error instanceof AppError ? error.message : "Failed to delete workout plan";
      }
    });
  }
  static {
    this.\u0275fac = function WorkoutPlanListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WorkoutPlanListComponent)(\u0275\u0275directiveInject(WorkoutPlanService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WorkoutPlanListComponent, selectors: [["app-workout-plan-list"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 13, vars: 7, consts: [[1, "container", "mx-auto", "px-4", "py-8"], [1, "mb-6"], [1, "text-3xl", "font-bold", "mb-4"], [1, "flex", "gap-4", "mb-4"], ["type", "text", "placeholder", "Search workout plans...", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "btn", "btn-primary", 3, "routerLink"], [3, "pageChange", "currentPage", "totalCount", "perPage"], [1, "alert", "alert-error", "mb-4"], [1, "grid", "grid-cols-1", "gap-4"], [1, "card"], [1, "ml-2", 3, "click"], [1, "p-4"], [1, "text-xl", "font-semibold", "mb-2"], [1, "prose", "max-w-none", "mb-4"], [1, "text-gray-600", "whitespace-pre-wrap", "font-sans", "text-base", "break-words"], [1, "mb-4"], [1, "flex", "gap-2"], [1, "btn", "btn-danger", 3, "click"], [1, "font-medium", "mb-2"], [1, "list-disc", "list-inside"]], template: function WorkoutPlanListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
        \u0275\u0275text(3, "My Workout Plans");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "input", 4);
        \u0275\u0275twoWayListener("ngModelChange", function WorkoutPlanListComponent_Template_input_ngModelChange_5_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
          return $event;
        });
        \u0275\u0275listener("input", function WorkoutPlanListComponent_Template_input_input_5_listener() {
          return ctx.onSearch();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "button", 5);
        \u0275\u0275text(7, " Create New Plan ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "app-pagination", 6);
        \u0275\u0275listener("pageChange", function WorkoutPlanListComponent_Template_app_pagination_pageChange_8_listener($event) {
          return ctx.changePage($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(9, WorkoutPlanListComponent_Conditional_9_Template, 4, 1, "div", 7);
        \u0275\u0275elementStart(10, "div", 8);
        \u0275\u0275repeaterCreate(11, WorkoutPlanListComponent_For_12_Template, 13, 6, "div", 9, _forTrack0);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
        \u0275\u0275advance();
        \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(6, _c0));
        \u0275\u0275advance(2);
        \u0275\u0275property("currentPage", ctx.pagination.currentPage)("totalCount", ctx.pagination.totalCount)("perPage", ctx.pagination.perPage);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 9 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.workoutPlans);
      }
    }, dependencies: [CommonModule, RouterModule, RouterLink, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, PaginationComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WorkoutPlanListComponent, { className: "WorkoutPlanListComponent" });
})();
export {
  WorkoutPlanListComponent
};
//# sourceMappingURL=chunk-JHBHHJVZ.js.map
