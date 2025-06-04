import {
  WorkoutPlanService
} from "./chunk-MLD7RI2K.js";
import {
  ExerciseService
} from "./chunk-JM5U7FVQ.js";
import "./chunk-GRRRYM6Y.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-FETORVPO.js";
import {
  AppError
} from "./chunk-AQ6Y7BDJ.js";
import "./chunk-NLRHYWXW.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-D7HEFMF2.js";
import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TOUTZUUN.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// src/app/pages/workout-plans/workout-plan-form/workout-plan-form.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function WorkoutPlanFormComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "Plan name is required");
    \u0275\u0275elementEnd();
  }
}
function WorkoutPlanFormComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "Description is required");
    \u0275\u0275elementEnd();
  }
}
function WorkoutPlanFormComponent_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 19);
    \u0275\u0275listener("click", function WorkoutPlanFormComponent_For_19_Template_button_click_3_listener() {
      const exercise_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.removeExercise(exercise_r2));
    });
    \u0275\u0275text(4, " Remove ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const exercise_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(exercise_r2.name);
  }
}
function WorkoutPlanFormComponent_For_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const exercise_r4 = ctx.$implicit;
    \u0275\u0275property("value", exercise_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(exercise_r4.name);
  }
}
var WorkoutPlanFormComponent = class _WorkoutPlanFormComponent {
  constructor(fb, workoutPlanService, exerciseService, router, route) {
    this.fb = fb;
    this.workoutPlanService = workoutPlanService;
    this.exerciseService = exerciseService;
    this.router = router;
    this.route = route;
    this.isEditing = false;
    this.isSubmitting = false;
    this.exercises = [];
    this.selectedExercises = [];
    this.error = null;
    this.subscriptions = [];
    this.pagination = {
      currentPage: 1,
      totalCount: 0,
      perPage: 6
    };
    this.workoutForm = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });
    this.subscriptions.push(this.exerciseService.totalCount$.subscribe((count) => {
      this.pagination = __spreadProps(__spreadValues({}, this.pagination), { totalCount: count });
    }));
  }
  ngOnInit() {
    this.subscriptions.push(this.exerciseService.data$.subscribe((exercises) => this.exercises = exercises));
    this.loadExercises();
    const workoutPlanId = this.route.snapshot.params["id"];
    if (workoutPlanId) {
      this.isEditing = true;
      this.loadWorkoutPlan(workoutPlanId);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  loadExercises() {
    try {
      this.exerciseService.loadExercises({
        page: this.pagination.currentPage,
        perPage: this.pagination.perPage
      }).subscribe(() => {
        this.error = null;
      }, (error) => {
        this.error = error instanceof AppError ? error.message : "Failed to load exercises";
      });
    } catch (error) {
      this.error = error instanceof AppError ? error.message : "Failed to load exercises";
    }
  }
  changePage(page) {
    this.pagination.currentPage = page;
    this.loadExercises();
  }
  loadWorkoutPlan(id) {
    try {
      this.workoutPlanService.getWorkoutPlan(id).subscribe((workoutPlan) => {
        if (workoutPlan) {
          this.workoutForm.patchValue({
            name: workoutPlan.name,
            description: workoutPlan.description
          });
          if (workoutPlan.exercises) {
            this.selectedExercises = workoutPlan.exercises.filter((we) => we.exercise).map((we) => we.exercise).sort((a, b) => a.name.localeCompare(b.name));
          }
        }
      }, (error) => {
        console.error("Error loading workout plan:", error);
      });
    } catch (error) {
      console.error("Error loading workout plan:", error);
    }
  }
  availableExercises() {
    return this.exercises.filter((exercise) => !this.selectedExercises.find((e) => e.id === exercise.id));
  }
  addExercise(event) {
    const select = event.target;
    const exerciseId = select.value;
    const exercise = this.exercises.find((e) => e.id === exerciseId);
    if (exercise) {
      this.selectedExercises = [...this.selectedExercises, exercise];
      select.value = "";
    }
  }
  removeExercise(exercise) {
    this.selectedExercises = this.selectedExercises.filter((e) => e.id !== exercise.id);
  }
  showError(field) {
    const control = this.workoutForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  onSubmit() {
    if (this.workoutForm.invalid)
      return;
    this.isSubmitting = true;
    try {
      const exercises = this.selectedExercises.map((exercise, index) => ({
        exercise_id: exercise.id,
        order: index + 1
      }));
      if (this.isEditing) {
        const workoutPlanId = this.route.snapshot.params["id"];
        this.workoutPlanService.updateWorkoutPlan(workoutPlanId, this.workoutForm.value, exercises).subscribe(() => {
          this.router.navigate(["/workout-plans"]);
        }, (error) => {
          console.error("Error updating workout plan:", error);
          this.isSubmitting = false;
        });
      } else {
        this.workoutPlanService.createWorkoutPlan(this.workoutForm.value, exercises).subscribe(() => {
          this.router.navigate(["/workout-plans"]);
        }, (error) => {
          console.error("Error creating workout plan:", error);
          this.isSubmitting = false;
        });
      }
    } catch (error) {
      console.error("Error saving workout plan:", error);
      this.isSubmitting = false;
    }
  }
  goBack() {
    this.router.navigate(["/workout-plans"]);
  }
  static {
    this.\u0275fac = function WorkoutPlanFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _WorkoutPlanFormComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(WorkoutPlanService), \u0275\u0275directiveInject(ExerciseService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WorkoutPlanFormComponent, selectors: [["app-workout-plan-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 31, vars: 11, consts: [[1, "max-w-lg", "mx-auto"], [1, "text-3xl", "font-bold", "mb-6"], [1, "card", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "name", 1, "form-label"], ["type", "text", "id", "name", "formControlName", "name", 1, "form-control"], [1, "text-red-500", "text-sm", "mt-1"], ["for", "description", 1, "form-label"], ["id", "description", "formControlName", "description", "rows", "3", 1, "form-control"], [1, "form-label"], [1, "space-y-2"], [1, "flex", "items-center", "gap-2", "p-2", "bg-gray-50", "rounded"], [1, "mt-2"], [1, "form-control", 3, "change", "value"], ["value", "", "disabled", ""], [3, "value"], [1, "flex", "gap-4", "mt-6"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "button", 1, "ml-auto", "text-red-500", 3, "click"]], template: function WorkoutPlanFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "form", 2);
        \u0275\u0275listener("ngSubmit", function WorkoutPlanFormComponent_Template_form_ngSubmit_3_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(4, "div", 3)(5, "label", 4);
        \u0275\u0275text(6, "Plan Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(7, "input", 5);
        \u0275\u0275template(8, WorkoutPlanFormComponent_Conditional_8_Template, 2, 0, "p", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 3)(10, "label", 7);
        \u0275\u0275text(11, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275element(12, "textarea", 8);
        \u0275\u0275template(13, WorkoutPlanFormComponent_Conditional_13_Template, 2, 0, "p", 6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "div", 3)(15, "label", 9);
        \u0275\u0275text(16, "Exercises");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "div", 10);
        \u0275\u0275repeaterCreate(18, WorkoutPlanFormComponent_For_19_Template, 5, 1, "div", 11, _forTrack0);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 12)(21, "select", 13);
        \u0275\u0275listener("change", function WorkoutPlanFormComponent_Template_select_change_21_listener($event) {
          return ctx.addExercise($event);
        });
        \u0275\u0275elementStart(22, "option", 14);
        \u0275\u0275text(23, "Add an exercise");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(24, WorkoutPlanFormComponent_For_25_Template, 2, 2, "option", 15, _forTrack0);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(26, "div", 16)(27, "button", 17);
        \u0275\u0275text(28);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "button", 18);
        \u0275\u0275listener("click", function WorkoutPlanFormComponent_Template_button_click_29_listener() {
          return ctx.goBack();
        });
        \u0275\u0275text(30, " Cancel ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.isEditing ? "Edit" : "New", " Workout Plan ");
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.workoutForm);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("name"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("name") ? 8 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("description"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("description") ? 13 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275repeater(ctx.selectedExercises);
        \u0275\u0275advance(3);
        \u0275\u0275property("value", "");
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.availableExercises());
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", ctx.workoutForm.invalid || ctx.isSubmitting);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isSubmitting ? "Saving..." : ctx.isEditing ? "Update" : "Create", " ");
      }
    }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WorkoutPlanFormComponent, { className: "WorkoutPlanFormComponent" });
})();
export {
  WorkoutPlanFormComponent
};
//# sourceMappingURL=chunk-HDYTWFDS.js.map
