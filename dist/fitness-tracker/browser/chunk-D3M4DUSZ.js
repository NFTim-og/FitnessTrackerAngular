import {
  RouterLink,
  RouterModule
} from "./chunk-D7HEFMF2.js";
import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-TOUTZUUN.js";
import "./chunk-WDMUDEB6.js";

// src/app/pages/home/home.component.ts
var HomeComponent = class _HomeComponent {
  static {
    this.\u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _HomeComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 11, vars: 0, consts: [[1, "container", "mx-auto", "px-4", "py-8"], [1, "text-center"], [1, "text-4xl", "font-bold", "mb-4"], [1, "text-xl", "mb-8"], [1, "flex", "justify-center", "gap-4"], ["routerLink", "/exercises", 1, "btn", "btn-primary"], ["routerLink", "/workout-plans", 1, "btn", "btn-primary"]], template: function HomeComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
        \u0275\u0275text(3, "Welcome to Fitness Tracker");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "p", 3);
        \u0275\u0275text(5, "Track your workouts, achieve your goals.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 4)(7, "a", 5);
        \u0275\u0275text(8, "View Exercises");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "a", 6);
        \u0275\u0275text(10, "Workout Plans");
        \u0275\u0275elementEnd()()()();
      }
    }, dependencies: [CommonModule, RouterModule, RouterLink], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent" });
})();
export {
  HomeComponent
};
//# sourceMappingURL=chunk-D3M4DUSZ.js.map
