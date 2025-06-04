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

// src/app/pages/auth/login/login.component.ts
function LoginComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Please enter a valid email");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1, "Password is required");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
var LoginComponent = class _LoginComponent {
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.isLoading = false;
    this.error = "";
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }
  showError(field) {
    const control = this.loginForm.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }
  onSubmit() {
    if (this.loginForm.invalid)
      return;
    this.isLoading = true;
    this.error = "";
    console.log("Login Component - Submitting login form");
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (result) => {
        console.log("Login Component - Login successful, token received:", !!result.token);
        console.log("Login Component - User:", result.user);
        this.router.navigate(["/"]);
      },
      error: (error) => {
        console.error("Login Component - Login error:", error);
        this.error = error.message || "An error occurred during login";
        this.isLoading = false;
      },
      complete: () => {
        console.log("Login Component - Login complete");
        this.isLoading = false;
      }
    });
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 18, vars: 10, consts: [[1, "min-h-[80vh]", "flex", "items-center", "justify-center"], [1, "max-w-md", "w-full"], [1, "text-3xl", "font-bold", "text-center", "mb-8"], [1, "card", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "email", 1, "form-label"], ["type", "email", "id", "email", "formControlName", "email", 1, "form-control"], [1, "text-red-500", "text-sm", "mt-1"], ["for", "password", 1, "form-label"], ["type", "password", "id", "password", "formControlName", "password", 1, "form-control"], [1, "text-red-500", "text-sm", "mb-4"], ["type", "submit", 1, "btn", "btn-primary", "w-full", 3, "disabled"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
        \u0275\u0275text(3, "Sign In");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "form", 3);
        \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_4_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(5, "div", 4)(6, "label", 5);
        \u0275\u0275text(7, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(8, "input", 6);
        \u0275\u0275template(9, LoginComponent_Conditional_9_Template, 2, 0, "p", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "div", 4)(11, "label", 8);
        \u0275\u0275text(12, "Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(13, "input", 9);
        \u0275\u0275template(14, LoginComponent_Conditional_14_Template, 2, 0, "p", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275template(15, LoginComponent_Conditional_15_Template, 2, 1, "div", 10);
        \u0275\u0275elementStart(16, "button", 11);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(4);
        \u0275\u0275property("formGroup", ctx.loginForm);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("email"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("email") ? 9 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("border-red-500", ctx.showError("password"));
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showError("password") ? 14 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 15 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.loginForm.invalid || ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isLoading ? "Signing in..." : "Sign In", " ");
      }
    }, dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent" });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-W5FOAXLS.js.map
