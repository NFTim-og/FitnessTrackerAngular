import {
  PaginationComponent
} from "./chunk-E5EQZOMU.js";
import {
  LoadingSpinnerComponent
} from "./chunk-RWITMZTM.js";
import {
  ExerciseService,
  LoadingService
} from "./chunk-JM5U7FVQ.js";
import "./chunk-GRRRYM6Y.js";
import {
  UserProfileService
} from "./chunk-DCSQS7UW.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
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
  AsyncPipe,
  CommonModule,
  NgClass,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
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

// src/app/shared/components/skeleton-loader/skeleton-loader.component.ts
function SkeletonLoaderComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.textClasses);
  }
}
function SkeletonLoaderComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.titleClasses);
  }
}
function SkeletonLoaderComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.avatarClasses);
  }
}
function SkeletonLoaderComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.buttonClasses);
  }
}
function SkeletonLoaderComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.imageClasses);
  }
}
function SkeletonLoaderComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "div", 7);
    \u0275\u0275elementStart(2, "div", 8);
    \u0275\u0275element(3, "div", 9)(4, "div", 10)(5, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 12);
    \u0275\u0275element(7, "div", 13)(8, "div", 13);
    \u0275\u0275elementEnd()();
  }
}
var SkeletonLoaderComponent = class _SkeletonLoaderComponent {
  constructor() {
    this.type = "text";
    this.count = 1;
  }
  get containerClasses() {
    const classes = [];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
  get textClasses() {
    const classes = ["h-4"];
    if (this.width) {
      classes.push(`w-${this.width}`);
    } else {
      classes.push("w-full");
    }
    if (this.height) {
      classes.push(`h-${this.height}`);
    }
    return classes.join(" ");
  }
  get titleClasses() {
    const classes = ["h-6"];
    if (this.width) {
      classes.push(`w-${this.width}`);
    } else {
      classes.push("w-3/4");
    }
    if (this.height) {
      classes.push(`h-${this.height}`);
    }
    return classes.join(" ");
  }
  get avatarClasses() {
    const classes = [];
    if (this.width && this.height) {
      classes.push(`w-${this.width}`, `h-${this.height}`);
    } else {
      classes.push("w-10", "h-10");
    }
    return classes.join(" ");
  }
  get buttonClasses() {
    const classes = ["h-10"];
    if (this.width) {
      classes.push(`w-${this.width}`);
    } else {
      classes.push("w-24");
    }
    if (this.height) {
      classes.push(`h-${this.height}`);
    }
    return classes.join(" ");
  }
  get imageClasses() {
    const classes = [];
    if (this.width && this.height) {
      classes.push(`w-${this.width}`, `h-${this.height}`);
    } else {
      classes.push("w-full", "h-48");
    }
    return classes.join(" ");
  }
  get skeletonArray() {
    return Array(this.count).fill(0);
  }
  static {
    this.\u0275fac = function SkeletonLoaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SkeletonLoaderComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SkeletonLoaderComponent, selectors: [["app-skeleton-loader"]], inputs: { type: "type", width: "width", height: "height", count: "count", className: "className" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 7, vars: 7, consts: [[1, "animate-pulse", 3, "ngClass"], ["class", "bg-gray-300 rounded", 3, "ngClass", 4, "ngIf"], ["class", "bg-gray-300 rounded-full", 3, "ngClass", 4, "ngIf"], ["class", "bg-white rounded-lg shadow p-4 space-y-3", 4, "ngIf"], [1, "bg-gray-300", "rounded", 3, "ngClass"], [1, "bg-gray-300", "rounded-full", 3, "ngClass"], [1, "bg-white", "rounded-lg", "shadow", "p-4", "space-y-3"], [1, "bg-gray-300", "rounded", "h-4", "w-3/4"], [1, "space-y-2"], [1, "bg-gray-300", "rounded", "h-3", "w-full"], [1, "bg-gray-300", "rounded", "h-3", "w-5/6"], [1, "bg-gray-300", "rounded", "h-3", "w-4/6"], [1, "flex", "space-x-2"], [1, "bg-gray-300", "rounded", "h-8", "w-16"]], template: function SkeletonLoaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, SkeletonLoaderComponent_div_1_Template, 1, 1, "div", 1)(2, SkeletonLoaderComponent_div_2_Template, 1, 1, "div", 1)(3, SkeletonLoaderComponent_div_3_Template, 1, 1, "div", 2)(4, SkeletonLoaderComponent_div_4_Template, 1, 1, "div", 1)(5, SkeletonLoaderComponent_div_5_Template, 1, 1, "div", 1)(6, SkeletonLoaderComponent_div_6_Template, 9, 0, "div", 3);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.containerClasses);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.type === "text");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.type === "title");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.type === "avatar");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.type === "button");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.type === "image");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.type === "card");
      }
    }, dependencies: [CommonModule, NgClass, NgIf], styles: ["\n\n.animate-pulse[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: .5;\n  }\n}\n/*# sourceMappingURL=skeleton-loader.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SkeletonLoaderComponent, { className: "SkeletonLoaderComponent" });
})();

// src/app/pages/exercises/exercise-list/exercise-list.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _c0 = () => ["/exercises/new"];
var _c1 = () => [1, 2, 3, 4, 5, 6];
var _c2 = (a0) => ["/exercises", a0, "edit"];
function ExerciseListComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 13);
    \u0275\u0275listener("click", function ExerciseListComponent_Conditional_1_Template_button_click_2_listener() {
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
function ExerciseListComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-spinner", 14);
    \u0275\u0275text(1, " Creating... ");
  }
}
function ExerciseListComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Add New Exercise ");
  }
}
function ExerciseListComponent_Conditional_21_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-skeleton-loader", 15);
  }
}
function ExerciseListComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, ExerciseListComponent_Conditional_21_For_2_Template, 1, 0, "app-skeleton-loader", 15, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c1));
  }
}
function ExerciseListComponent_Conditional_23_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1, " (Set your weight in profile for accurate calculation) ");
    \u0275\u0275elementEnd();
  }
}
function ExerciseListComponent_Conditional_23_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "h3", 18);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 19)(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275template(8, ExerciseListComponent_Conditional_23_For_2_Conditional_8_Template, 2, 0, "span", 20);
    \u0275\u0275pipe(9, "async");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 21);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 22);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 23)(15, "button", 24);
    \u0275\u0275text(16, " Edit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 25);
    \u0275\u0275listener("click", function ExerciseListComponent_Conditional_23_For_2_Template_button_click_17_listener() {
      const exercise_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteExercise(exercise_r4.id));
    });
    \u0275\u0275text(18, " Delete ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const exercise_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(exercise_r4.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Duration: ", exercise_r4.duration, " minutes");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Calories: ", ctx_r1.calculateCalories(exercise_r4), " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!\u0275\u0275pipeBind1(9, 7, ctx_r1.userProfile$) ? 8 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Difficulty: ", exercise_r4.difficulty, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("MET: ", exercise_r4.met_value, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(9, _c2, exercise_r4.id));
  }
}
function ExerciseListComponent_Conditional_23_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "p", 26);
    \u0275\u0275text(2, "No exercises found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 27);
    \u0275\u0275text(4, " Create your first exercise ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(1, _c0));
  }
}
function ExerciseListComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275repeaterCreate(1, ExerciseListComponent_Conditional_23_For_2_Template, 19, 11, "div", 16, _forTrack0, false, ExerciseListComponent_Conditional_23_ForEmpty_3_Template, 5, 2, "div", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.exercises);
  }
}
var ExerciseListComponent = class _ExerciseListComponent {
  constructor(exerciseService, userProfileService, loadingService) {
    this.exerciseService = exerciseService;
    this.userProfileService = userProfileService;
    this.loadingService = loadingService;
    this.exercises = [];
    this.searchQuery = "";
    this.selectedDifficulty = "";
    this.error = null;
    this.userProfile$ = this.userProfileService.profile$;
    this.pagination = {
      currentPage: 1,
      totalCount: 0,
      perPage: 6
    };
    this.isLoadingExercises$ = this.loadingService.isLoading("loadExercises");
    this.isCreatingExercise$ = this.loadingService.isLoading("createExercise");
    this.exerciseService.totalCount$.subscribe((count) => {
      this.pagination = __spreadProps(__spreadValues({}, this.pagination), { totalCount: count });
    });
  }
  ngOnInit() {
    console.log("ExerciseListComponent - Initializing");
    this.exerciseService.data$.subscribe((exercises) => {
      console.log("ExerciseListComponent - Received exercises:", exercises);
      this.exercises = exercises;
    });
    this.exerciseService.totalCount$.subscribe((totalCount) => {
      console.log("ExerciseListComponent - Received total count:", totalCount);
      this.pagination.totalCount = totalCount;
    });
    this.loadExercises();
  }
  loadExercises() {
    return __async(this, null, function* () {
      console.log("ExerciseListComponent - Loading exercises");
      try {
        yield this.exerciseService.loadExercises({
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        });
        console.log("ExerciseListComponent - Exercises loaded successfully");
        console.log("ExerciseListComponent - Current exercises:", this.exercises);
        console.log("ExerciseListComponent - Pagination:", this.pagination);
        this.error = null;
      } catch (error) {
        console.error("ExerciseListComponent - Error loading exercises:", error);
        this.error = error instanceof AppError ? error.message : "Failed to load exercises";
      }
    });
  }
  onSearch() {
    return __async(this, null, function* () {
      this.pagination.currentPage = 1;
      try {
        yield this.exerciseService.searchExercises(this.searchQuery, this.selectedDifficulty, {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        });
      } catch (error) {
        this.error = error instanceof AppError ? error.message : "Failed to search exercises";
      }
    });
  }
  changePage(page) {
    return __async(this, null, function* () {
      this.pagination.currentPage = page;
      if (this.searchQuery || this.selectedDifficulty) {
        yield this.exerciseService.searchExercises(this.searchQuery, this.selectedDifficulty, {
          page: this.pagination.currentPage,
          perPage: this.pagination.perPage
        });
      } else {
        yield this.loadExercises();
      }
    });
  }
  deleteExercise(id) {
    return __async(this, null, function* () {
      if (!confirm("Are you sure you want to delete this exercise?"))
        return;
      try {
        yield this.exerciseService.deleteExercise(id);
        this.error = null;
      } catch (error) {
        this.error = error instanceof AppError ? error.message : "Failed to delete exercise";
      }
    });
  }
  calculateCalories(exercise) {
    return this.userProfileService.calculateCalories(exercise.met_value, exercise.duration);
  }
  static {
    this.\u0275fac = function ExerciseListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExerciseListComponent)(\u0275\u0275directiveInject(ExerciseService), \u0275\u0275directiveInject(UserProfileService), \u0275\u0275directiveInject(LoadingService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExerciseListComponent, selectors: [["app-exercise-list"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 24, vars: 17, consts: [[1, "mb-6"], [1, "alert", "alert-error", "mb-4"], [1, "text-3xl", "font-bold", "mb-4"], [1, "flex", "gap-4", "mb-4"], ["type", "text", "placeholder", "Search exercises...", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "form-control", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "easy"], ["value", "medium"], ["value", "hard"], [1, "btn", "btn-primary", 3, "routerLink", "disabled"], [3, "pageChange", "currentPage", "totalCount", "perPage"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4"], [1, "ml-2", 3, "click"], ["size", "small", "color", "white", 1, "mr-2"], ["type", "card"], [1, "card"], [1, "col-span-full", "text-center", "py-8"], [1, "text-xl", "font-semibold", "mb-2"], [1, "mb-4"], [1, "text-sm", "text-gray-500"], [1, "capitalize"], [1, "text-sm", "text-gray-600"], [1, "flex", "gap-2"], [1, "btn", "btn-primary", 3, "routerLink"], [1, "btn", "btn-danger", 3, "click"], [1, "text-gray-500", "text-lg"], [1, "btn", "btn-primary", "mt-4", 3, "routerLink"]], template: function ExerciseListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, ExerciseListComponent_Conditional_1_Template, 4, 1, "div", 1);
        \u0275\u0275elementStart(2, "h1", 2);
        \u0275\u0275text(3, "My Exercises");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "input", 4);
        \u0275\u0275twoWayListener("ngModelChange", function ExerciseListComponent_Template_input_ngModelChange_5_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event);
          return $event;
        });
        \u0275\u0275listener("input", function ExerciseListComponent_Template_input_input_5_listener() {
          return ctx.onSearch();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "select", 5);
        \u0275\u0275twoWayListener("ngModelChange", function ExerciseListComponent_Template_select_ngModelChange_6_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.selectedDifficulty, $event) || (ctx.selectedDifficulty = $event);
          return $event;
        });
        \u0275\u0275listener("change", function ExerciseListComponent_Template_select_change_6_listener() {
          return ctx.onSearch();
        });
        \u0275\u0275elementStart(7, "option", 6);
        \u0275\u0275text(8, "All Difficulties");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "option", 7);
        \u0275\u0275text(10, "Easy");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "option", 8);
        \u0275\u0275text(12, "Medium");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "option", 9);
        \u0275\u0275text(14, "Hard");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(15, "button", 10);
        \u0275\u0275pipe(16, "async");
        \u0275\u0275template(17, ExerciseListComponent_Conditional_17_Template, 2, 0);
        \u0275\u0275pipe(18, "async");
        \u0275\u0275template(19, ExerciseListComponent_Conditional_19_Template, 1, 0);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "app-pagination", 11);
        \u0275\u0275listener("pageChange", function ExerciseListComponent_Template_app_pagination_pageChange_20_listener($event) {
          return ctx.changePage($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(21, ExerciseListComponent_Conditional_21_Template, 3, 1, "div", 12);
        \u0275\u0275pipe(22, "async");
        \u0275\u0275template(23, ExerciseListComponent_Conditional_23_Template, 4, 1, "div", 12);
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 1 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275twoWayProperty("ngModel", ctx.searchQuery);
        \u0275\u0275advance();
        \u0275\u0275twoWayProperty("ngModel", ctx.selectedDifficulty);
        \u0275\u0275advance(9);
        \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(16, _c0))("disabled", \u0275\u0275pipeBind1(16, 10, ctx.isLoadingExercises$));
        \u0275\u0275advance(2);
        \u0275\u0275conditional(\u0275\u0275pipeBind1(18, 12, ctx.isCreatingExercise$) ? 17 : 19);
        \u0275\u0275advance(3);
        \u0275\u0275property("currentPage", ctx.pagination.currentPage)("totalCount", ctx.pagination.totalCount)("perPage", ctx.pagination.perPage);
        \u0275\u0275advance();
        \u0275\u0275conditional(\u0275\u0275pipeBind1(22, 14, ctx.isLoadingExercises$) ? 21 : 23);
      }
    }, dependencies: [CommonModule, AsyncPipe, RouterModule, RouterLink, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, PaginationComponent, LoadingSpinnerComponent, SkeletonLoaderComponent], styles: ["\n\n.btn-danger[_ngcontent-%COMP%] {\n  background-color: var(--danger-color);\n  color: white;\n}\n.btn-danger[_ngcontent-%COMP%]:hover {\n  background-color: #dc2626;\n}\n/*# sourceMappingURL=exercise-list.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExerciseListComponent, { className: "ExerciseListComponent" });
})();
export {
  ExerciseListComponent
};
//# sourceMappingURL=chunk-GNZHUEHX.js.map
