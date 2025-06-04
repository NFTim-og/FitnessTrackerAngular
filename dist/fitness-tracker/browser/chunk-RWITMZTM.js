import {
  CommonModule,
  NgClass,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-TOUTZUUN.js";

// src/app/shared/components/loading-spinner/loading-spinner.component.ts
function LoadingSpinnerComponent_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r0.messageClasses);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.message, " ");
  }
}
var LoadingSpinnerComponent = class _LoadingSpinnerComponent {
  constructor() {
    this.size = "medium";
    this.color = "primary";
    this.showMessage = false;
    this.overlay = false;
    this.fullScreen = false;
  }
  get containerClasses() {
    const classes = [];
    if (this.overlay) {
      classes.push("absolute inset-0 bg-white bg-opacity-75 z-10");
    }
    if (this.fullScreen) {
      classes.push("fixed inset-0 bg-white bg-opacity-90 z-50");
    }
    return classes.join(" ");
  }
  get spinnerClasses() {
    const classes = [];
    switch (this.size) {
      case "small":
        classes.push("h-4 w-4 border-2");
        break;
      case "medium":
        classes.push("h-8 w-8 border-3");
        break;
      case "large":
        classes.push("h-12 w-12 border-4");
        break;
    }
    switch (this.color) {
      case "primary":
        classes.push("border-blue-600");
        break;
      case "secondary":
        classes.push("border-gray-600");
        break;
      case "white":
        classes.push("border-white");
        break;
      case "gray":
        classes.push("border-gray-400");
        break;
    }
    return classes.join(" ");
  }
  get messageClasses() {
    const classes = [];
    switch (this.color) {
      case "primary":
        classes.push("text-blue-600");
        break;
      case "secondary":
        classes.push("text-gray-600");
        break;
      case "white":
        classes.push("text-white");
        break;
      case "gray":
        classes.push("text-gray-500");
        break;
    }
    return classes.join(" ");
  }
  static {
    this.\u0275fac = function LoadingSpinnerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoadingSpinnerComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoadingSpinnerComponent, selectors: [["app-loading-spinner"]], inputs: { size: "size", color: "color", message: "message", showMessage: "showMessage", overlay: "overlay", fullScreen: "fullScreen" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 5, consts: [[1, "flex", "items-center", "justify-center", 3, "ngClass"], ["role", "status", 1, "animate-spin", "rounded-full", "border-solid", "border-t-transparent", 3, "ngClass"], [1, "sr-only"], ["class", "ml-3 text-sm font-medium", 3, "ngClass", 4, "ngIf"], [1, "ml-3", "text-sm", "font-medium", 3, "ngClass"]], template: function LoadingSpinnerComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(4, LoadingSpinnerComponent_span_4_Template, 2, 2, "span", 3);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.containerClasses);
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", ctx.spinnerClasses);
        \u0275\u0275attribute("aria-label", ctx.message || "Loading");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.message || "Loading...");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showMessage && ctx.message);
      }
    }, dependencies: [CommonModule, NgClass, NgIf], styles: ["\n\n.animate-spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=loading-spinner.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoadingSpinnerComponent, { className: "LoadingSpinnerComponent" });
})();

export {
  LoadingSpinnerComponent
};
//# sourceMappingURL=chunk-RWITMZTM.js.map
