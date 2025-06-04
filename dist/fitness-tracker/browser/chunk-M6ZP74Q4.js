import "./chunk-WDMUDEB6.js";

// src/app/pages/workout-plans/workout-plan.routes.ts
var WORKOUT_PLAN_ROUTES = [
  {
    path: "",
    loadComponent: () => import("./chunk-JHBHHJVZ.js").then((m) => m.WorkoutPlanListComponent)
  },
  {
    path: "new",
    loadComponent: () => import("./chunk-HDYTWFDS.js").then((m) => m.WorkoutPlanFormComponent)
  },
  {
    path: ":id/edit",
    loadComponent: () => import("./chunk-HDYTWFDS.js").then((m) => m.WorkoutPlanFormComponent)
  }
];
export {
  WORKOUT_PLAN_ROUTES
};
//# sourceMappingURL=chunk-M6ZP74Q4.js.map
