import {
  AuthService
} from "./chunk-ZA3SGJBQ.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-FETORVPO.js";
import "./chunk-AQ6Y7BDJ.js";
import "./chunk-NLRHYWXW.js";
import {
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TOUTZUUN.js";
import "./chunk-WDMUDEB6.js";

// src/app/pages/auth/register/register.component.ts
function RegisterComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Please enter a valid email");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, " Password must be at least 8 characters and contain at least one number ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, " Please confirm your password ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, " Passwords do not match ");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
var RegisterComponent = class _RegisterComponent {
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.isLoading = false;
    this.error = "";
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/.*\d.*/)
        // At least one number
      ]],
      passwordConfirmation: ["", [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  // Custom validator to check if password and confirmation match
  passwordMatchValidator(form) {
    const password = form.get("password")?.value;
    const passwordConfirmation = form.get("passwordConfirmation")?.value;
    if (password === passwordConfirmation) {
      return null;
    }
    return { passwordMismatch: true };
  }
  showError(field) {
    const control = this.registerForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  onSubmit() {
    if (this.registerForm.invalid)
      return;
    this.isLoading = true;
    this.error = "";
    this.authService.register(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.passwordConfirmation).subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.error = error.message || "An error occurred during registration";
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  static {
    this.\u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RegisterComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 24, vars: 14, consts: [[1, "min-h-[80vh]", "flex", "items-center", "justify-center"], [1, "max-w-md", "w-full"], [1, "text-3xl", "font-bold", "text-center", "mb-8"], [1, "card", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "email", 1, "form-label"], ["type", "email", "id", "email", "formControlName", "email", 1, "form-control"], [1, "text-red-500", "text-sm", "mt-1"], ["for", "password", 1, "form-label"], ["type", "password", "id", "password", "formControlName", "password", 1, "form-control"], ["for", "passwordConfirmation", 1, "form-label"], ["type", "password", "id", "passwordConfirmation", "formControlName", "passwordConfirmation", 1, "form-control"], [1, "text-red-500", "text-sm", "mb-4"], ["type", "submit", 1, "btn", "btn-primary", "w-full", 3, "disabled"]], template: function RegisterComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
        \u0275\u0275text(3, "Create Account");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "form", 3);
        \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_4_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(5, "div", 4)(6, "label", 5);
        \u0275\u0275text(7, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(8, "input", 6);
        \u0275\u0275template(9, RegisterComponent_Conditional_9_Template, 2, 0, "p", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "div", 4)(11, "label", 8);
        \u0275\u0275text(12, "Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(13, "input", 9);
        \u0275\u0275template(14, RegisterComponent_Conditional_14_Template, 2, 0, "p", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 4)(16, "label", 10);
        \u0275\u0275text(17, "Confirm Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(18, "input", 11);
        \u0275\u0275template(19, RegisterComponent_Conditional_19_Template, 2, 0, "p", 7)(20, RegisterComponent_Conditional_20_Template, 2, 0, "p", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275template(21, RegisterComponent_Conditional_21_Template, 2, 1, "div", 12);
        \u0275\u0275elementStart(22, "button", 13);
        \u0275\u0275text(23);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_7_0;
        \u0275\u0275advance(4);
        \u0275\u0275property("formGroup", ctx.registerForm);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("email"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("email") ? 9 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("password"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("password") ? 14 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("passwordConfirmation") || ctx.registerForm.hasError("passwordMismatch"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("passwordConfirmation") ? 19 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.registerForm.hasError("passwordMismatch") && !ctx.showError("passwordConfirmation") && ((tmp_7_0 = ctx.registerForm.get("passwordConfirmation")) == null ? null : tmp_7_0.touched) ? 20 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 21 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.registerForm.invalid || ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isLoading ? "Creating account..." : "Create Account", " ");
      }
    }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent" });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=chunk-PIKIFZ3B.js.map
