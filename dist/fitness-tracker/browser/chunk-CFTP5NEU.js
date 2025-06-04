import {
  environment
} from "./chunk-NLRHYWXW.js";
import {
  CommonModule,
  HttpClient,
  NgIf,
  catchError,
  map,
  of,
  tap,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-TOUTZUUN.js";
import "./chunk-WDMUDEB6.js";

// src/app/shared/services/api-test.service.ts
var ApiTestService = class _ApiTestService {
  constructor(http) {
    this.http = http;
    this.apiUrl = environment.apiUrl;
  }
  /**
   * Test the API health endpoint
   */
  testHealth() {
    console.log("Testing health endpoint:", `${this.apiUrl}/health`);
    return this.http.get(`${this.apiUrl}/health`).pipe(map((response) => {
      console.log("API Health Response:", response);
      return response.status === "success";
    }), catchError((error) => {
      console.error("API Health Error:", error);
      return of(false);
    }));
  }
  /**
   * Test user registration
   */
  testRegistration() {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: "password123"
    };
    return this.http.post(`${this.apiUrl}/auth/register`, testUser).pipe(map((response) => {
      console.log("API Registration Response:", response);
      return response.status === "success" && !!response.token;
    }), catchError((error) => {
      console.error("API Registration Error:", error);
      return of(false);
    }));
  }
  /**
   * Run all API tests
   */
  runAllTests() {
    const results = {};
    return this.testHealth().pipe(
      tap((result) => results["health"] = result),
      tap(() => console.log("Health test result:", results["health"])),
      // Chain the registration test
      tap(() => {
        if (results["health"]) {
          this.testRegistration().subscribe((result) => {
            results["registration"] = result;
            console.log("Registration test result:", results["registration"]);
          });
        }
      }),
      // Return all results
      map(() => results)
    );
  }
  static {
    this.\u0275fac = function ApiTestService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ApiTestService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiTestService, factory: _ApiTestService.\u0275fac, providedIn: "root" });
  }
};

// src/app/components/api-test/api-test.component.ts
function ApiTestComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r0.testResults["health"] ? "text-success" : "text-danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.testResults["health"] ? "\u2713 Success" : "\u2717 Failed", " ");
  }
}
function ApiTestComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 8);
    \u0275\u0275text(2, "Not tested");
    \u0275\u0275elementEnd()();
  }
}
function ApiTestComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r0.testResults["registration"] ? "text-success" : "text-danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.testResults["registration"] ? "\u2713 Success" : "\u2717 Failed", " ");
  }
}
function ApiTestComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 8);
    \u0275\u0275text(2, "Not tested");
    \u0275\u0275elementEnd()();
  }
}
var ApiTestComponent = class _ApiTestComponent {
  constructor(apiTestService) {
    this.apiTestService = apiTestService;
    this.testResults = {};
    this.isRunningTests = false;
  }
  ngOnInit() {
    console.log("ApiTestComponent - Initializing");
  }
  runTests() {
    console.log("ApiTestComponent - Running tests");
    this.isRunningTests = true;
    this.testResults = {};
    this.apiTestService.runAllTests().subscribe({
      next: (results) => {
        console.log("ApiTestComponent - Test results:", results);
        this.testResults = results;
        this.isRunningTests = false;
      },
      error: (error) => {
        console.error("ApiTestComponent - Error running tests:", error);
        this.isRunningTests = false;
      }
    });
  }
  static {
    this.\u0275fac = function ApiTestComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ApiTestComponent)(\u0275\u0275directiveInject(ApiTestService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ApiTestComponent, selectors: [["app-api-test"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 44, vars: 6, consts: [[1, "container", "mt-5"], [1, "card", "mt-3"], [1, "card-body"], [1, "card-title"], [1, "mt-3"], [4, "ngIf"], [1, "mt-4"], [1, "btn", "btn-primary", 3, "click", "disabled"], [1, "text-secondary"]], template: function ApiTestComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h2");
        \u0275\u0275text(2, "API Integration Test");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "div", 1)(4, "div", 2)(5, "h5", 3);
        \u0275\u0275text(6, "Test Results");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "div", 4)(8, "h6");
        \u0275\u0275text(9, "Health Endpoint:");
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, ApiTestComponent_div_10_Template, 3, 3, "div", 5)(11, ApiTestComponent_div_11_Template, 3, 0, "div", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 4)(13, "h6");
        \u0275\u0275text(14, "User Registration:");
        \u0275\u0275elementEnd();
        \u0275\u0275template(15, ApiTestComponent_div_15_Template, 3, 3, "div", 5)(16, ApiTestComponent_div_16_Template, 3, 0, "div", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "div", 6)(18, "button", 7);
        \u0275\u0275listener("click", function ApiTestComponent_Template_button_click_18_listener() {
          return ctx.runTests();
        });
        \u0275\u0275text(19);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(20, "div", 6)(21, "p")(22, "strong");
        \u0275\u0275text(23, "Note:");
        \u0275\u0275elementEnd();
        \u0275\u0275text(24, " Make sure the backend server is running on ");
        \u0275\u0275elementStart(25, "code");
        \u0275\u0275text(26, "http://localhost:3000");
        \u0275\u0275elementEnd();
        \u0275\u0275text(27, " before running these tests. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div")(29, "strong");
        \u0275\u0275text(30, "Backend Setup:");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "ol")(32, "li");
        \u0275\u0275text(33, "Navigate to the backend directory: ");
        \u0275\u0275elementStart(34, "code");
        \u0275\u0275text(35, "cd backend");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(36, "li");
        \u0275\u0275text(37, "Install dependencies: ");
        \u0275\u0275elementStart(38, "code");
        \u0275\u0275text(39, "npm install");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(40, "li");
        \u0275\u0275text(41, "Start the server: ");
        \u0275\u0275elementStart(42, "code");
        \u0275\u0275text(43, "npm run dev");
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ctx.testResults["health"] !== void 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.testResults["health"] === void 0);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.testResults["registration"] !== void 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.testResults["registration"] === void 0);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.isRunningTests);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isRunningTests ? "Running Tests..." : "Run Tests", " ");
      }
    }, dependencies: [CommonModule, NgIf], styles: ["\n\n.container[_ngcontent-%COMP%] {\n  max-width: 800px;\n}\n/*# sourceMappingURL=api-test.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ApiTestComponent, { className: "ApiTestComponent" });
})();
export {
  ApiTestComponent
};
//# sourceMappingURL=chunk-CFTP5NEU.js.map
