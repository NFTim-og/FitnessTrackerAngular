import { Routes } from '@angular/router';

export const WORKOUT_PLAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./workout-plan-list/workout-plan-list.component')
        .then(m => m.WorkoutPlanListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./workout-plan-form/workout-plan-form.component')
        .then(m => m.WorkoutPlanFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./workout-plan-form/workout-plan-form.component')
        .then(m => m.WorkoutPlanFormComponent)
  }
];