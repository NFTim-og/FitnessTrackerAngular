import "./chunk-WDMUDEB6.js";

// src/app/pages/exercises/exercise.routes.ts
var EXERCISE_ROUTES = [
  {
    path: "",
    loadComponent: () => import("./chunk-GNZHUEHX.js").then((m) => m.ExerciseListComponent)
  },
  {
    path: "new",
    loadComponent: () => import("./chunk-KSQGVCSQ.js").then((m) => m.ExerciseFormComponent)
  },
  {
    path: ":id/edit",
    loadComponent: () => import("./chunk-KSQGVCSQ.js").then((m) => m.ExerciseFormComponent)
  }
];
export {
  EXERCISE_ROUTES
};
//# sourceMappingURL=chunk-QBLR7XSO.js.map
