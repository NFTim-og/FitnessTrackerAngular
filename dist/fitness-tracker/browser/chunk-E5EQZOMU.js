import {
  CommonModule,
  EventEmitter,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-TOUTZUUN.js";

// src/app/shared/components/pagination/pagination.component.ts
function PaginationComponent_Conditional_0_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 3);
    \u0275\u0275listener("click", function PaginationComponent_Conditional_0_For_4_Template_button_click_0_listener() {
      const page_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPageChange(page_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("btn-primary", ctx_r1.currentPage === page_r4)("btn-secondary", ctx_r1.currentPage !== page_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", page_r4, " ");
  }
}
function PaginationComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "button", 1);
    \u0275\u0275listener("click", function PaginationComponent_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPageChange(ctx_r1.currentPage - 1));
    });
    \u0275\u0275text(2, " Previous ");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, PaginationComponent_Conditional_0_For_4_Template, 2, 5, "button", 2, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(5, "button", 1);
    \u0275\u0275listener("click", function PaginationComponent_Conditional_0_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPageChange(ctx_r1.currentPage + 1));
    });
    \u0275\u0275text(6, " Next ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.currentPage === 1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.pages);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.currentPage === ctx_r1.totalPages);
  }
}
var PaginationComponent = class _PaginationComponent {
  constructor() {
    this.currentPage = 1;
    this.totalCount = 0;
    this.perPage = 10;
    this.pageChange = new EventEmitter();
  }
  get totalPages() {
    return Math.ceil(this.totalCount / this.perPage);
  }
  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  onPageChange(page) {
    this.pageChange.emit(page);
  }
  static {
    this.\u0275fac = function PaginationComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PaginationComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PaginationComponent, selectors: [["app-pagination"]], inputs: { currentPage: "currentPage", totalCount: "totalCount", perPage: "perPage" }, outputs: { pageChange: "pageChange" }, standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 1, vars: 1, consts: [[1, "flex", "justify-center", "gap-2", "mb-6"], [1, "btn", "btn-secondary", 3, "click", "disabled"], [1, "btn", 3, "btn-primary", "btn-secondary"], [1, "btn", 3, "click"]], template: function PaginationComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, PaginationComponent_Conditional_0_Template, 7, 2, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.totalPages > 1 ? 0 : -1);
      }
    }, dependencies: [CommonModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PaginationComponent, { className: "PaginationComponent" });
})();

export {
  PaginationComponent
};
//# sourceMappingURL=chunk-E5EQZOMU.js.map
