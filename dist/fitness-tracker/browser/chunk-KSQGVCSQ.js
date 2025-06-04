import {
  LoadingSpinnerComponent
} from "./chunk-RWITMZTM.js";
import {
  ExerciseService,
  LoadingService
} from "./chunk-JM5U7FVQ.js";
import {
  Exercise
} from "./chunk-GRRRYM6Y.js";
import {
  UserProfileService
} from "./chunk-DCSQS7UW.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgControlStatusGroup,
  RadioControlValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
  ɵNgNoValidate
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
  AsyncPipe,
  CommonModule,
  NgIf,
  forwardRef,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TOUTZUUN.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// src/app/shared/services/validation.service.ts
var ValidationService = class _ValidationService {
  static {
    this.EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  }
  static {
    this.PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  }
  /**
   * Validate email format
   */
  static emailValidator() {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const valid = _ValidationService.EMAIL_PATTERN.test(control.value);
      return valid ? null : { email: { value: control.value } };
    };
  }
  /**
   * Validate password strength
   */
  static passwordValidator() {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const value = control.value;
      const errors = {};
      if (value.length < 8) {
        errors.minLength = { requiredLength: 8, actualLength: value.length };
      }
      if (!/[a-z]/.test(value)) {
        errors.lowercase = true;
      }
      if (!/[A-Z]/.test(value)) {
        errors.uppercase = true;
      }
      if (!/\d/.test(value)) {
        errors.number = true;
      }
      return Object.keys(errors).length ? { password: errors } : null;
    };
  }
  /**
   * Validate that passwords match
   */
  static passwordMatchValidator(passwordField, confirmPasswordField) {
    return (control) => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);
      if (!password || !confirmPassword) {
        return null;
      }
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors["passwordMismatch"];
          confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
        }
        return null;
      }
    };
  }
  /**
   * Validate positive number
   */
  static positiveNumberValidator() {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const value = parseFloat(control.value);
      return value > 0 ? null : { positiveNumber: { value: control.value } };
    };
  }
  /**
   * Validate number range
   */
  static rangeValidator(min, max) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const value = parseFloat(control.value);
      if (isNaN(value)) {
        return { range: { value: control.value, min, max } };
      }
      if (value < min || value > max) {
        return { range: { value, min, max } };
      }
      return null;
    };
  }
  /**
   * Validate minimum length for strings
   */
  static minLengthValidator(minLength) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const value = control.value.toString();
      return value.length >= minLength ? null : {
        minLength: { requiredLength: minLength, actualLength: value.length }
      };
    };
  }
  /**
   * Validate maximum length for strings
   */
  static maxLengthValidator(maxLength) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const value = control.value.toString();
      return value.length <= maxLength ? null : {
        maxLength: { requiredLength: maxLength, actualLength: value.length }
      };
    };
  }
  /**
   * Validate that a value is one of the allowed options
   */
  static optionsValidator(allowedOptions) {
    return (control) => {
      if (!control.value) {
        return null;
      }
      const valid = allowedOptions.includes(control.value);
      return valid ? null : { options: { value: control.value, allowedOptions } };
    };
  }
  /**
   * Get user-friendly error message for validation errors
   */
  static getErrorMessage(fieldName, errors) {
    if (errors["required"]) {
      return `${fieldName} is required`;
    }
    if (errors["email"]) {
      return "Please enter a valid email address";
    }
    if (errors["password"]) {
      const passwordErrors = errors["password"];
      const messages = [];
      if (passwordErrors.minLength) {
        messages.push(`at least ${passwordErrors.minLength.requiredLength} characters`);
      }
      if (passwordErrors.lowercase) {
        messages.push("one lowercase letter");
      }
      if (passwordErrors.uppercase) {
        messages.push("one uppercase letter");
      }
      if (passwordErrors.number) {
        messages.push("one number");
      }
      return `Password must contain ${messages.join(", ")}`;
    }
    if (errors["passwordMismatch"]) {
      return "Passwords do not match";
    }
    if (errors["positiveNumber"]) {
      return `${fieldName} must be a positive number`;
    }
    if (errors["range"]) {
      const { min, max } = errors["range"];
      return `${fieldName} must be between ${min} and ${max}`;
    }
    if (errors["minLength"]) {
      const { requiredLength } = errors["minLength"];
      return `${fieldName} must be at least ${requiredLength} characters long`;
    }
    if (errors["maxLength"]) {
      const { requiredLength } = errors["maxLength"];
      return `${fieldName} must be no more than ${requiredLength} characters long`;
    }
    if (errors["options"]) {
      const { allowedOptions } = errors["options"];
      return `${fieldName} must be one of: ${allowedOptions.join(", ")}`;
    }
    return `${fieldName} is invalid`;
  }
  /**
   * Check if a form control has a specific error
   */
  static hasError(control, errorType) {
    return !!(control && control.errors && control.errors[errorType] && control.touched);
  }
  /**
   * Get the first error message for a form control
   */
  static getFirstErrorMessage(fieldName, control) {
    if (!control || !control.errors || !control.touched) {
      return null;
    }
    return _ValidationService.getErrorMessage(fieldName, control.errors);
  }
  static {
    this.\u0275fac = function ValidationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ValidationService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ValidationService, factory: _ValidationService.\u0275fac, providedIn: "root" });
  }
};

// src/app/shared/components/form-field/form-field.component.ts
function FormFieldComponent_label_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 9);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormFieldComponent_label_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 7);
    \u0275\u0275text(1);
    \u0275\u0275template(2, FormFieldComponent_label_1_span_2_Template, 2, 0, "span", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("text-red-700", ctx_r0.hasError);
    \u0275\u0275property("for", ctx_r0.fieldId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.required);
  }
}
function FormFieldComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 11);
    \u0275\u0275elementEnd();
  }
}
function FormFieldComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "path", 13);
    \u0275\u0275elementEnd()();
  }
}
function FormFieldComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 14);
    \u0275\u0275element(2, "path", 15);
    \u0275\u0275elementEnd()();
  }
}
function FormFieldComponent_p_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.helpText, " ");
  }
}
function FormFieldComponent_p_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("id", ctx_r0.fieldId + "-error");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
var FormFieldComponent = class _FormFieldComponent {
  constructor() {
    this.type = "text";
    this.required = false;
    this.disabled = false;
    this.readonly = false;
    this.loading = false;
    this.showSuccess = true;
    this.value = "";
    this.onChange = (value) => {
    };
    this.onTouched = () => {
    };
    this.fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
  }
  get hasError() {
    return !!(this.control && this.control.errors && this.control.touched);
  }
  get errorMessage() {
    if (!this.hasError || !this.control || !this.fieldName) {
      return null;
    }
    return ValidationService.getFirstErrorMessage(this.fieldName, this.control);
  }
  get inputClasses() {
    const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors";
    if (this.hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    if (this.showSuccess && this.value && !this.loading && this.control?.valid) {
      return `${baseClasses} border-green-300 text-green-900 focus:ring-green-500 focus:border-green-500`;
    }
    if (this.disabled) {
      return `${baseClasses} border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed`;
    }
    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  }
  // ControlValueAccessor implementation
  writeValue(value) {
    this.value = value || "";
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  // Event handlers
  onInput(event) {
    const target = event.target;
    this.value = target.value;
    this.onChange(this.value);
  }
  onBlur() {
    this.onTouched();
  }
  onFocus() {
  }
  static {
    this.\u0275fac = function FormFieldComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FormFieldComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormFieldComponent, selectors: [["app-form-field"]], inputs: { label: "label", placeholder: "placeholder", type: "type", required: "required", disabled: "disabled", readonly: "readonly", loading: "loading", showSuccess: "showSuccess", helpText: "helpText", control: "control", fieldName: "fieldName" }, standalone: true, features: [\u0275\u0275ProvidersFeature([
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => _FormFieldComponent),
        multi: true
      }
    ]), \u0275\u0275StandaloneFeature], decls: 9, vars: 16, consts: [[1, "form-field"], ["class", "block text-sm font-medium text-gray-700 mb-1", 3, "for", "text-red-700", 4, "ngIf"], [1, "relative"], [1, "block", "w-full", "px-3", "py-2", "border", "rounded-md", "shadow-sm", "focus:outline-none", "focus:ring-2", "focus:ring-offset-0", "sm:text-sm", "transition-colors", 3, "input", "blur", "focus", "id", "type", "placeholder", "disabled", "readonly", "value"], ["class", "absolute inset-y-0 right-0 flex items-center pr-3", 4, "ngIf"], ["class", "mt-1 text-sm text-gray-500", 4, "ngIf"], ["class", "mt-1 text-sm text-red-600", "role", "alert", 3, "id", 4, "ngIf"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1", 3, "for"], ["class", "text-red-500 ml-1", 4, "ngIf"], [1, "text-red-500", "ml-1"], [1, "absolute", "inset-y-0", "right-0", "flex", "items-center", "pr-3"], [1, "animate-spin", "h-4", "w-4", "border-2", "border-gray-300", "border-t-blue-600", "rounded-full"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "h-4", "w-4", "text-green-500"], ["fill-rule", "evenodd", "d", "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", "clip-rule", "evenodd"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "h-4", "w-4", "text-red-500"], ["fill-rule", "evenodd", "d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", "clip-rule", "evenodd"], [1, "mt-1", "text-sm", "text-gray-500"], ["role", "alert", 1, "mt-1", "text-sm", "text-red-600", 3, "id"]], template: function FormFieldComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, FormFieldComponent_label_1_Template, 3, 5, "label", 1);
        \u0275\u0275elementStart(2, "div", 2)(3, "input", 3);
        \u0275\u0275listener("input", function FormFieldComponent_Template_input_input_3_listener($event) {
          return ctx.onInput($event);
        })("blur", function FormFieldComponent_Template_input_blur_3_listener() {
          return ctx.onBlur();
        })("focus", function FormFieldComponent_Template_input_focus_3_listener() {
          return ctx.onFocus();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275template(4, FormFieldComponent_div_4_Template, 2, 0, "div", 4)(5, FormFieldComponent_div_5_Template, 3, 0, "div", 4)(6, FormFieldComponent_div_6_Template, 3, 0, "div", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275template(7, FormFieldComponent_p_7_Template, 2, 1, "p", 5)(8, FormFieldComponent_p_8_Template, 2, 2, "p", 6);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.label);
        \u0275\u0275advance(2);
        \u0275\u0275classMap(ctx.inputClasses);
        \u0275\u0275property("id", ctx.fieldId)("type", ctx.type)("placeholder", ctx.placeholder)("disabled", ctx.disabled)("readonly", ctx.readonly)("value", ctx.value);
        \u0275\u0275attribute("aria-describedby", ctx.hasError ? ctx.fieldId + "-error" : null)("aria-invalid", ctx.hasError);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showSuccess && !ctx.hasError && ctx.value && !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.hasError);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.helpText && !ctx.hasError);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.hasError);
      }
    }, dependencies: [CommonModule, NgIf], styles: ["\n\n.form-field[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.animate-spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=form-field.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormFieldComponent, { className: "FormFieldComponent" });
})();

// src/app/pages/exercises/exercise-form/exercise-form.component.ts
function ExerciseFormComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 21);
    \u0275\u0275listener("click", function ExerciseFormComponent_Conditional_1_Template_button_click_2_listener() {
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
function ExerciseFormComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "app-loading-spinner", 22);
    \u0275\u0275text(2, " Loading Exercise... ");
    \u0275\u0275elementEnd();
  }
}
function ExerciseFormComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isEditing ? "Edit" : "New", " Exercise ");
  }
}
function ExerciseFormComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "h3", 23);
    \u0275\u0275text(2, "About MET Values");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 24);
    \u0275\u0275text(4, " MET (Metabolic Equivalent of Task) represents the energy cost of physical activities. Common values: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ul", 25)(6, "li");
    \u0275\u0275text(7, "Light activity (walking slowly): 2-3 METs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "li");
    \u0275\u0275text(9, "Moderate activity (brisk walking): 3-6 METs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "li");
    \u0275\u0275text(11, "Vigorous activity (running): 6+ METs");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "p");
    \u0275\u0275text(13, " Your calories burned will be calculated based on your weight and the MET value. ");
    \u0275\u0275elementEnd()();
  }
}
function ExerciseFormComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.getFieldError("Difficulty"));
  }
}
function ExerciseFormComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "p", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 27);
    \u0275\u0275text(4, " Based on your current weight and the exercise parameters ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Estimated Calories: ", ctx_r1.estimatedCalories, " kcal ");
  }
}
function ExerciseFormComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-spinner", 28);
    \u0275\u0275text(1, " Saving... ");
  }
}
function ExerciseFormComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isEditing ? "Update" : "Create", " Exercise ");
  }
}
var ExerciseFormComponent = class _ExerciseFormComponent {
  constructor(fb, exerciseService, userProfileService, router, route, loadingService) {
    this.fb = fb;
    this.exerciseService = exerciseService;
    this.userProfileService = userProfileService;
    this.router = router;
    this.route = route;
    this.loadingService = loadingService;
    this.isEditing = false;
    this.isSubmitting = false;
    this.error = null;
    this.showMetInfo = false;
    this.estimatedCalories = 0;
    this.isLoadingExercise$ = this.loadingService.isLoading("loadExercise");
    this.isSavingExercise$ = this.loadingService.isLoading("saveExercise");
    this.exerciseForm = this.fb.group({
      name: ["", [
        Validators.required,
        ValidationService.minLengthValidator(2),
        ValidationService.maxLengthValidator(100)
      ]],
      duration: ["", [
        Validators.required,
        ValidationService.positiveNumberValidator(),
        ValidationService.rangeValidator(1, 300)
      ]],
      met_value: [4, [
        Validators.required,
        ValidationService.positiveNumberValidator(),
        ValidationService.rangeValidator(0.1, 20)
      ]],
      difficulty: ["", [
        Validators.required,
        ValidationService.optionsValidator(["easy", "medium", "hard"])
      ]]
    });
    this.profileSubscription = this.userProfileService.profile$.subscribe(() => {
      this.updateCalories();
    });
    this.formSubscription = this.exerciseForm.valueChanges.subscribe(() => {
      this.updateCalories();
    });
  }
  ngOnInit() {
    const exerciseId = this.route.snapshot.params["id"];
    if (exerciseId) {
      this.isEditing = true;
      this.loadExercise(exerciseId);
    } else {
      this.updateCalories();
    }
  }
  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
  loadExercise(id) {
    this.loadingService.start("loadExercise");
    this.exerciseService.getExercise(id).subscribe({
      next: (exercise) => {
        if (exercise) {
          this.exerciseForm.patchValue(exercise);
          this.updateCalories();
          this.error = null;
        }
        this.loadingService.stop("loadExercise");
      },
      error: (error) => {
        this.error = error instanceof AppError ? error.message : "Failed to load exercise";
        this.loadingService.stop("loadExercise");
      }
    });
  }
  showError(field) {
    const control = this.exerciseForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  getFieldError(fieldName) {
    const control = this.exerciseForm.get(fieldName);
    return ValidationService.getFirstErrorMessage(fieldName, control);
  }
  getFormControl(fieldName) {
    return this.exerciseForm.get(fieldName);
  }
  updateCalories() {
    const duration = this.exerciseForm.get("duration")?.value;
    const metValue = this.exerciseForm.get("met_value")?.value;
    if (duration && metValue) {
      this.estimatedCalories = this.userProfileService.calculateCalories(metValue, duration);
    } else if (metValue) {
      this.estimatedCalories = this.userProfileService.calculateCalories(metValue, 0);
    } else {
      this.estimatedCalories = 0;
    }
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.exerciseForm.invalid) {
        this.exerciseForm.markAllAsTouched();
        return;
      }
      console.log("ExerciseFormComponent - Form submitted");
      console.log("ExerciseFormComponent - Form values:", this.exerciseForm.value);
      this.loadingService.start("saveExercise");
      this.isSubmitting = true;
      try {
        this.updateCalories();
        const formValues = this.exerciseForm.value;
        const exercise = new Exercise({
          name: formValues.name,
          duration: Number(formValues.duration),
          met_value: Number(formValues.met_value),
          difficulty: formValues.difficulty,
          calories: this.estimatedCalories
        });
        console.log("ExerciseFormComponent - Exercise object:", exercise);
        if (this.isEditing) {
          const exerciseId = this.route.snapshot.params["id"];
          console.log("ExerciseFormComponent - Updating exercise with ID:", exerciseId);
          const updateData = {
            name: exercise.name,
            duration: exercise.duration,
            met_value: exercise.met_value,
            difficulty: exercise.difficulty,
            calories: exercise.calories
          };
          yield this.exerciseService.updateExercise(exerciseId, updateData);
          console.log("ExerciseFormComponent - Exercise updated successfully");
        } else {
          console.log("ExerciseFormComponent - Creating new exercise");
          yield this.exerciseService.createExercise(exercise);
          console.log("ExerciseFormComponent - Exercise created successfully");
        }
        this.router.navigate(["/exercises"]);
        this.error = null;
      } catch (error) {
        console.error("ExerciseFormComponent - Error saving exercise:", error);
        this.error = error instanceof AppError ? error.message : "Failed to save exercise";
      } finally {
        this.isSubmitting = false;
        this.loadingService.stop("saveExercise");
      }
    });
  }
  goBack() {
    this.router.navigate(["/exercises"]);
  }
  static {
    this.\u0275fac = function ExerciseFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExerciseFormComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(ExerciseService), \u0275\u0275directiveInject(UserProfileService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(LoadingService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExerciseFormComponent, selectors: [["app-exercise-form"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 40, vars: 23, consts: [[1, "max-w-lg", "mx-auto"], [1, "alert", "alert-error", "mb-4"], [1, "text-3xl", "font-bold", "mb-6"], [1, "flex", "items-center"], [1, "card", 3, "ngSubmit", "formGroup"], ["label", "Exercise Name", "type", "text", "placeholder", "Enter exercise name", "fieldName", "Name", "helpText", "Enter a descriptive name for your exercise (2-100 characters)", "formControlName", "name", 3, "control", "required"], ["label", "Duration (minutes)", "type", "number", "placeholder", "Enter duration in minutes", "fieldName", "Duration", "helpText", "Exercise duration between 1-300 minutes", "formControlName", "duration", 3, "control", "required"], [1, "form-group"], [1, "form-label"], [1, "ml-2", "text-sm", "text-blue-600", "cursor-pointer", 3, "click"], ["type", "number", "placeholder", "Enter MET value (e.g., 4.0)", "fieldName", "MET Value", "helpText", "Metabolic Equivalent of Task (0.1-20.0)", "formControlName", "met_value", 3, "control", "required"], [1, "bg-blue-50", "p-4", "rounded-lg", "mb-4"], [1, "flex", "gap-4"], ["type", "radio", "formControlName", "difficulty", "value", "easy", 1, "mr-2"], ["type", "radio", "formControlName", "difficulty", "value", "medium", 1, "mr-2"], ["type", "radio", "formControlName", "difficulty", "value", "hard", 1, "mr-2"], [1, "text-red-500", "text-sm", "mt-1"], [1, "bg-green-50", "p-4", "rounded-lg", "mb-4"], [1, "flex", "gap-4", "mt-6"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], [1, "ml-2", 3, "click"], ["size", "small", 1, "mr-2"], [1, "font-semibold", "mb-2"], [1, "mb-2"], [1, "list-disc", "list-inside", "mb-2"], [1, "font-semibold"], [1, "text-sm", "text-gray-600"], ["size", "small", "color", "white", 1, "mr-2"]], template: function ExerciseFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, ExerciseFormComponent_Conditional_1_Template, 4, 1, "div", 1);
        \u0275\u0275elementStart(2, "h1", 2);
        \u0275\u0275template(3, ExerciseFormComponent_Conditional_3_Template, 3, 0, "div", 3);
        \u0275\u0275pipe(4, "async");
        \u0275\u0275template(5, ExerciseFormComponent_Conditional_5_Template, 1, 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "form", 4);
        \u0275\u0275listener("ngSubmit", function ExerciseFormComponent_Template_form_ngSubmit_6_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275element(7, "app-form-field", 5)(8, "app-form-field", 6);
        \u0275\u0275elementStart(9, "div", 7)(10, "label", 8);
        \u0275\u0275text(11, " MET Value ");
        \u0275\u0275elementStart(12, "span", 9);
        \u0275\u0275listener("click", function ExerciseFormComponent_Template_span_click_12_listener() {
          return ctx.showMetInfo = !ctx.showMetInfo;
        });
        \u0275\u0275text(13, " \u2139\uFE0F What's this? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(14, "app-form-field", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275template(15, ExerciseFormComponent_Conditional_15_Template, 14, 0, "div", 11);
        \u0275\u0275elementStart(16, "div", 7)(17, "label", 8);
        \u0275\u0275text(18, "Difficulty");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "div", 12)(20, "label", 3);
        \u0275\u0275element(21, "input", 13);
        \u0275\u0275text(22, " Easy ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "label", 3);
        \u0275\u0275element(24, "input", 14);
        \u0275\u0275text(25, " Medium ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "label", 3);
        \u0275\u0275element(27, "input", 15);
        \u0275\u0275text(28, " Hard ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(29, ExerciseFormComponent_Conditional_29_Template, 2, 1, "p", 16);
        \u0275\u0275elementEnd();
        \u0275\u0275template(30, ExerciseFormComponent_Conditional_30_Template, 5, 1, "div", 17);
        \u0275\u0275elementStart(31, "div", 18)(32, "button", 19);
        \u0275\u0275pipe(33, "async");
        \u0275\u0275template(34, ExerciseFormComponent_Conditional_34_Template, 2, 0);
        \u0275\u0275pipe(35, "async");
        \u0275\u0275template(36, ExerciseFormComponent_Conditional_36_Template, 1, 1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "button", 20);
        \u0275\u0275pipe(38, "async");
        \u0275\u0275listener("click", function ExerciseFormComponent_Template_button_click_37_listener() {
          return ctx.goBack();
        });
        \u0275\u0275text(39, " Cancel ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 1 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(\u0275\u0275pipeBind1(4, 15, ctx.isLoadingExercise$) ? 3 : 5);
        \u0275\u0275advance(3);
        \u0275\u0275property("formGroup", ctx.exerciseForm);
        \u0275\u0275advance();
        \u0275\u0275property("control", ctx.getFormControl("name"))("required", true);
        \u0275\u0275advance();
        \u0275\u0275property("control", ctx.getFormControl("duration"))("required", true);
        \u0275\u0275advance(6);
        \u0275\u0275property("control", ctx.getFormControl("met_value"))("required", true);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showMetInfo ? 15 : -1);
        \u0275\u0275advance(14);
        \u0275\u0275conditional(ctx.showError("difficulty") ? 29 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.estimatedCalories > 0 ? 30 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.exerciseForm.invalid || \u0275\u0275pipeBind1(33, 17, ctx.isSavingExercise$));
        \u0275\u0275advance(2);
        \u0275\u0275conditional(\u0275\u0275pipeBind1(35, 19, ctx.isSavingExercise$) ? 34 : 36);
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", \u0275\u0275pipeBind1(38, 21, ctx.isSavingExercise$));
      }
    }, dependencies: [CommonModule, AsyncPipe, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName, FormFieldComponent, LoadingSpinnerComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExerciseFormComponent, { className: "ExerciseFormComponent" });
})();
export {
  ExerciseFormComponent
};
//# sourceMappingURL=chunk-KSQGVCSQ.js.map
