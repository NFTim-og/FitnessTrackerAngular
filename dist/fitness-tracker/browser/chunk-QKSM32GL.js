import {
  AuthService
} from "./chunk-ZA3SGJBQ.js";
import {
  UserProfileService
} from "./chunk-DCSQS7UW.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-FETORVPO.js";
import {
  AppError
} from "./chunk-AQ6Y7BDJ.js";
import "./chunk-NLRHYWXW.js";
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  firstValueFrom,
  map,
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
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-TOUTZUUN.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// src/app/pages/profile/update-password/update-password.component.ts
function UpdatePasswordComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1, " Password updated successfully! ");
    \u0275\u0275elementStart(2, "button", 14);
    \u0275\u0275listener("click", function UpdatePasswordComponent_Conditional_3_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.success = false);
    });
    \u0275\u0275text(3, "\xD7");
    \u0275\u0275elementEnd()();
  }
}
function UpdatePasswordComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 14);
    \u0275\u0275listener("click", function UpdatePasswordComponent_Conditional_4_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r3);
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
function UpdatePasswordComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, " Current password is required ");
    \u0275\u0275elementEnd();
  }
}
function UpdatePasswordComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, " New password must be at least 8 characters and contain at least one number ");
    \u0275\u0275elementEnd();
  }
}
function UpdatePasswordComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, " Please confirm your new password ");
    \u0275\u0275elementEnd();
  }
}
function UpdatePasswordComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, " Passwords do not match ");
    \u0275\u0275elementEnd();
  }
}
var UpdatePasswordComponent = class _UpdatePasswordComponent {
  constructor(fb, authService) {
    this.fb = fb;
    this.authService = authService;
    this.isSubmitting = false;
    this.error = null;
    this.success = false;
    this.passwordForm = this.fb.group({
      currentPassword: ["", [Validators.required]],
      newPassword: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/.*\d.*/)
        // At least one number
      ]],
      newPasswordConfirmation: ["", [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  // Custom validator to check if password and confirmation match
  passwordMatchValidator(form) {
    const newPassword = form.get("newPassword")?.value;
    const newPasswordConfirmation = form.get("newPasswordConfirmation")?.value;
    if (newPassword === newPasswordConfirmation) {
      return null;
    }
    return { passwordMismatch: true };
  }
  showError(field) {
    const control = this.passwordForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  onSubmit() {
    if (this.passwordForm.invalid)
      return;
    this.isSubmitting = true;
    this.error = null;
    this.success = false;
    const { currentPassword, newPassword, newPasswordConfirmation } = this.passwordForm.value;
    this.authService.updatePassword(currentPassword, newPassword, newPasswordConfirmation).subscribe({
      next: () => {
        this.success = true;
        this.passwordForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.error = error.message || "Failed to update password";
        this.isSubmitting = false;
      }
    });
  }
  static {
    this.\u0275fac = function UpdatePasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _UpdatePasswordComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UpdatePasswordComponent, selectors: [["app-update-password"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 24, vars: 15, consts: [[1, "card"], [1, "text-xl", "font-semibold", "mb-4"], [1, "alert", "alert-success", "mb-4"], [1, "alert", "alert-error", "mb-4"], [3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "currentPassword", 1, "form-label"], ["type", "password", "id", "currentPassword", "formControlName", "currentPassword", 1, "form-control"], [1, "text-red-500", "text-sm", "mt-1"], ["for", "newPassword", 1, "form-label"], ["type", "password", "id", "newPassword", "formControlName", "newPassword", 1, "form-control"], ["for", "newPasswordConfirmation", 1, "form-label"], ["type", "password", "id", "newPasswordConfirmation", "formControlName", "newPasswordConfirmation", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "ml-2", 3, "click"]], template: function UpdatePasswordComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h2", 1);
        \u0275\u0275text(2, "Update Password");
        \u0275\u0275elementEnd();
        \u0275\u0275template(3, UpdatePasswordComponent_Conditional_3_Template, 4, 0, "div", 2)(4, UpdatePasswordComponent_Conditional_4_Template, 4, 1, "div", 3);
        \u0275\u0275elementStart(5, "form", 4);
        \u0275\u0275listener("ngSubmit", function UpdatePasswordComponent_Template_form_ngSubmit_5_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(6, "div", 5)(7, "label", 6);
        \u0275\u0275text(8, "Current Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(9, "input", 7);
        \u0275\u0275template(10, UpdatePasswordComponent_Conditional_10_Template, 2, 0, "p", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "div", 5)(12, "label", 9);
        \u0275\u0275text(13, "New Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(14, "input", 10);
        \u0275\u0275template(15, UpdatePasswordComponent_Conditional_15_Template, 2, 0, "p", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "div", 5)(17, "label", 11);
        \u0275\u0275text(18, "Confirm New Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(19, "input", 12);
        \u0275\u0275template(20, UpdatePasswordComponent_Conditional_20_Template, 2, 0, "p", 8)(21, UpdatePasswordComponent_Conditional_21_Template, 2, 0, "p", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "button", 13);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        let tmp_9_0;
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx.success ? 3 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 4 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.passwordForm);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("currentPassword"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("currentPassword") ? 10 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("newPassword"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("newPassword") ? 15 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("newPasswordConfirmation") || ctx.passwordForm.hasError("passwordMismatch"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("newPasswordConfirmation") ? 20 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.passwordForm.hasError("passwordMismatch") && !ctx.showError("newPasswordConfirmation") && ((tmp_9_0 = ctx.passwordForm.get("newPasswordConfirmation")) == null ? null : tmp_9_0.touched) ? 21 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.passwordForm.invalid || ctx.isSubmitting);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isSubmitting ? "Updating..." : "Update Password", " ");
      }
    }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UpdatePasswordComponent, { className: "UpdatePasswordComponent" });
})();

// src/app/pages/profile/profile.component.ts
var _forTrack0 = ($index, $item) => $item.id;
var _c0 = () => ({ standalone: true });
function ProfileComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 13);
    \u0275\u0275listener("click", function ProfileComponent_Conditional_1_Template_button_click_2_listener() {
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
function ProfileComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "h2", 14);
    \u0275\u0275text(2, "Account Information");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 15);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r3 = ctx;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("User ID: ", user_r3.id, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Email: ", user_r3.email, "");
  }
}
function ProfileComponent_Conditional_6_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, " Weight must be between 30kg and 300kg ");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_Conditional_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, " Height must be between 100cm and 250cm ");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_Conditional_6_Conditional_13_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 15);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", entry_r5.weight_kg, " kg");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(5, 2, entry_r5.recorded_at, "medium"), " ");
  }
}
function ProfileComponent_Conditional_6_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "h2", 7);
    \u0275\u0275text(2, "Weight History");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 24);
    \u0275\u0275repeaterCreate(4, ProfileComponent_Conditional_6_Conditional_13_For_5_Template, 6, 5, "div", 25, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.weightHistory);
  }
}
function ProfileComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 16);
    \u0275\u0275listener("ngSubmit", function ProfileComponent_Conditional_6_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubmit());
    });
    \u0275\u0275elementStart(1, "div", 17)(2, "label", 18);
    \u0275\u0275text(3, "Weight (kg)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "input", 19);
    \u0275\u0275template(5, ProfileComponent_Conditional_6_Conditional_5_Template, 2, 0, "p", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 17)(7, "label", 21);
    \u0275\u0275text(8, "Height (cm)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "input", 22);
    \u0275\u0275template(10, ProfileComponent_Conditional_6_Conditional_10_Template, 2, 0, "p", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 23);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(13, ProfileComponent_Conditional_6_Conditional_13_Template, 6, 0, "div", 5);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r1.profileForm);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-500", ctx_r1.showError("weight"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showError("weight") ? 5 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-500", ctx_r1.showError("height"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showError("height") ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.profileForm.invalid || ctx_r1.isSubmitting);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isSubmitting ? "Saving..." : "Save Changes", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.weightHistory.length > 0 ? 13 : -1);
  }
}
function ProfileComponent_Conditional_8_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, " Weight must be between 30kg and 300kg ");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_Conditional_8_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, " Height must be between 100cm and 250cm ");
    \u0275\u0275elementEnd();
  }
}
function ProfileComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 16);
    \u0275\u0275listener("ngSubmit", function ProfileComponent_Conditional_8_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubmit());
    });
    \u0275\u0275elementStart(1, "h2", 7);
    \u0275\u0275text(2, "Complete Your Profile");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 8);
    \u0275\u0275text(4, " Please enter your weight and height to enable personalized calorie calculations. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 17)(6, "label", 18);
    \u0275\u0275text(7, "Weight (kg)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "input", 19);
    \u0275\u0275template(9, ProfileComponent_Conditional_8_Conditional_9_Template, 2, 0, "p", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 17)(11, "label", 21);
    \u0275\u0275text(12, "Height (cm)");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "input", 22);
    \u0275\u0275template(14, ProfileComponent_Conditional_8_Conditional_14_Template, 2, 0, "p", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 23);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r1.profileForm);
    \u0275\u0275advance(8);
    \u0275\u0275classProp("border-red-500", ctx_r1.showError("weight"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showError("weight") ? 9 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("border-red-500", ctx_r1.showError("height"));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showError("height") ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.profileForm.invalid || ctx_r1.isSubmitting);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isSubmitting ? "Creating Profile..." : "Create Profile", " ");
  }
}
function ProfileComponent_Conditional_9_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("text-green-500", !ctx_r1.roleUpdateError)("text-red-500", ctx_r1.roleUpdateError);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.roleUpdateMessage, " ");
  }
}
function ProfileComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "h2", 7);
    \u0275\u0275text(2, "Admin Controls");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 8);
    \u0275\u0275text(4, "You have administrative privileges.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 17)(6, "label", 26);
    \u0275\u0275text(7, "User Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 27);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_Conditional_9_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.userEmail, $event) || (ctx_r1.userEmail = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 17)(10, "label", 28);
    \u0275\u0275text(11, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "select", 29);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_Conditional_9_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedRole, $event) || (ctx_r1.selectedRole = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(13, "option", 30);
    \u0275\u0275text(14, "User");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 31);
    \u0275\u0275text(16, "Admin");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "button", 32);
    \u0275\u0275listener("click", function ProfileComponent_Conditional_9_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.updateUserRole());
    });
    \u0275\u0275text(18, " Update User Role ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(19, ProfileComponent_Conditional_9_Conditional_19_Template, 2, 5, "p", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.userEmail);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(6, _c0));
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedRole);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(7, _c0));
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", !ctx_r1.userEmail);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.roleUpdateMessage ? 19 : -1);
  }
}
var ProfileComponent = class _ProfileComponent {
  constructor(fb, userProfileService, authService) {
    this.fb = fb;
    this.userProfileService = userProfileService;
    this.authService = authService;
    this.profile$ = this.userProfileService.profile$;
    this.isAdmin$ = this.authService.user$.pipe(map((user) => user?.role === "admin"));
    this.isSubmitting = false;
    this.weightHistory = [];
    this.error = null;
    this.userEmail = "";
    this.selectedRole = "user";
    this.currentUser$ = this.authService.user$;
    this.roleUpdateMessage = "";
    this.roleUpdateError = false;
    this.profileForm = this.fb.group({
      weight: ["", [Validators.required, Validators.min(30), Validators.max(300)]],
      height: ["", [Validators.required, Validators.min(100), Validators.max(250)]]
    });
  }
  ngOnInit() {
    console.log("ProfileComponent - Initializing");
    this.loadWeightHistory();
    this.profile$.subscribe((profile) => {
      console.log("ProfileComponent - Profile loaded:", profile);
      if (profile) {
        this.profileForm.patchValue({
          weight: profile.weight_kg,
          height: profile.height_cm
        });
      }
    });
    this.authService.user$.subscribe((user) => {
      console.log("ProfileComponent - Current user:", user);
    });
  }
  loadWeightHistory() {
    return __async(this, null, function* () {
      console.log("ProfileComponent - Loading weight history");
      try {
        this.weightHistory = [];
        this.error = null;
        console.log("ProfileComponent - Weight history loaded successfully");
      } catch (error) {
        console.error("ProfileComponent - Error loading weight history:", error);
        this.error = error instanceof AppError ? error.message : "Failed to load weight history";
      }
    });
  }
  updateUserRole() {
    return __async(this, null, function* () {
      try {
        this.roleUpdateMessage = "";
        this.roleUpdateError = false;
        this.roleUpdateMessage = `Role update functionality will be implemented later`;
        this.error = null;
        this.userEmail = "";
        this.selectedRole = "user";
      } catch (error) {
        const message = error instanceof AppError ? error.message : "Failed to update user role";
        this.roleUpdateMessage = message;
        this.roleUpdateError = true;
      }
    });
  }
  showError(field) {
    const control = this.profileForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.profileForm.invalid)
        return;
      this.isSubmitting = true;
      try {
        const profile = yield firstValueFrom(this.userProfileService.profile$);
        const { weight, height } = this.profileForm.value;
        if (profile) {
          yield this.userProfileService.updateProfile(weight, height);
        } else {
          yield this.userProfileService.createProfile(weight, height);
        }
        this.error = null;
        yield this.loadWeightHistory();
      } catch (error) {
        this.error = error instanceof AppError ? error.message : "Failed to save profile";
      } finally {
        this.isSubmitting = false;
      }
    });
  }
  static {
    this.\u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProfileComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(UserProfileService), \u0275\u0275directiveInject(AuthService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 36, vars: 10, consts: [[1, "max-w-lg", "mx-auto"], [1, "alert", "alert-error", "mb-4"], [1, "text-3xl", "font-bold", "mb-6"], [1, "card", "mb-6"], [1, "card", 3, "formGroup"], [1, "card", "mt-6"], [1, "mt-6"], [1, "text-xl", "font-semibold", "mb-4"], [1, "mb-4"], [1, "font-semibold", "mb-2"], [1, "list-disc", "list-inside", "space-y-1"], [1, "mt-4"], [1, "bg-gray-100", "px-2", "py-1", "rounded"], [1, "ml-2", 3, "click"], [1, "text-xl", "font-semibold", "mb-2"], [1, "text-sm", "text-gray-600"], [1, "card", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "weight", 1, "form-label"], ["type", "number", "id", "weight", "formControlName", "weight", "step", "0.1", 1, "form-control"], [1, "text-red-500", "text-sm", "mt-1"], ["for", "height", 1, "form-label"], ["type", "number", "id", "height", "formControlName", "height", "step", "0.1", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [1, "space-y-2"], [1, "flex", "justify-between", "items-center"], ["for", "userEmail", 1, "form-label"], ["type", "email", "id", "userEmail", 1, "form-control", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["for", "userRole", 1, "form-label"], ["id", "userRole", 1, "form-control", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["value", "user"], ["value", "admin"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "mt-4", 3, "text-green-500", "text-red-500"]], template: function ProfileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275template(1, ProfileComponent_Conditional_1_Template, 4, 1, "div", 1);
        \u0275\u0275elementStart(2, "h1", 2);
        \u0275\u0275text(3, "Profile Settings");
        \u0275\u0275elementEnd();
        \u0275\u0275template(4, ProfileComponent_Conditional_4_Template, 7, 2, "div", 3);
        \u0275\u0275pipe(5, "async");
        \u0275\u0275template(6, ProfileComponent_Conditional_6_Template, 14, 10);
        \u0275\u0275pipe(7, "async");
        \u0275\u0275template(8, ProfileComponent_Conditional_8_Template, 17, 9, "form", 4)(9, ProfileComponent_Conditional_9_Template, 20, 8, "div", 5);
        \u0275\u0275pipe(10, "async");
        \u0275\u0275elementStart(11, "div", 6);
        \u0275\u0275element(12, "app-update-password");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "div", 5)(14, "h2", 7);
        \u0275\u0275text(15, "About MET Values");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "p", 8);
        \u0275\u0275text(17, " MET (Metabolic Equivalent of Task) is a measure of energy used by the body during an activity. A MET of 1 represents resting energy expenditure, while higher MET values indicate more intense exercises. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "h3", 9);
        \u0275\u0275text(19, "Common MET Values:");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "ul", 10)(21, "li");
        \u0275\u0275text(22, "Walking (3.5 mph) - MET 3.5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "li");
        \u0275\u0275text(24, "Cycling (12-14 mph) - MET 8.0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "li");
        \u0275\u0275text(26, "Running (6 mph) - MET 10.0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "li");
        \u0275\u0275text(28, "Swimming laps - MET 6.0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "li");
        \u0275\u0275text(30, "Weight training - MET 3.5");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(31, "p", 11);
        \u0275\u0275text(32, " Your calories burned are calculated using the formula: ");
        \u0275\u0275element(33, "br");
        \u0275\u0275elementStart(34, "code", 12);
        \u0275\u0275text(35, " Calories = MET \xD7 Weight (kg) \xD7 Duration (hours) ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_1_0;
        let tmp_2_0;
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 1 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275conditional((tmp_1_0 = \u0275\u0275pipeBind1(5, 4, ctx.currentUser$)) ? 4 : -1, tmp_1_0);
        \u0275\u0275advance(2);
        \u0275\u0275conditional((tmp_2_0 = \u0275\u0275pipeBind1(7, 6, ctx.profile$)) ? 6 : 8, tmp_2_0);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(\u0275\u0275pipeBind1(10, 8, ctx.isAdmin$) ? 9 : -1);
      }
    }, dependencies: [CommonModule, AsyncPipe, DatePipe, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, FormsModule, NgModel, UpdatePasswordComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent" });
})();
export {
  ProfileComponent
};
//# sourceMappingURL=chunk-QKSM32GL.js.map
