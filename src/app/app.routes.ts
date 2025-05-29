import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'exercises',
    loadChildren: () =>
      import('./pages/exercises/exercise.routes').then(m => m.EXERCISE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'workout-plans',
    loadChildren: () =>
      import('./pages/workout-plans/workout-plan.routes').then(m => m.WORKOUT_PLAN_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'api-test',
    loadComponent: () =>
      import('./components/api-test/api-test.component').then(m => m.ApiTestComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];