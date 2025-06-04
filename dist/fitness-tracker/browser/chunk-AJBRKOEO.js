import "./chunk-WDMUDEB6.js";

// src/app/pages/auth/auth.routes.ts
var AUTH_ROUTES = [
  {
    path: "login",
    loadComponent: () => import("./chunk-W5FOAXLS.js").then((m) => m.LoginComponent)
  },
  {
    path: "register",
    loadComponent: () => import("./chunk-PIKIFZ3B.js").then((m) => m.RegisterComponent)
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
];
export {
  AUTH_ROUTES
};
//# sourceMappingURL=chunk-AJBRKOEO.js.map
