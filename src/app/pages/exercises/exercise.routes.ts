import { Routes } from '@angular/router';

export const EXERCISE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./exercise-list/exercise-list.component').then(m => m.ExerciseListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./exercise-form/exercise-form.component').then(m => m.ExerciseFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./exercise-form/exercise-form.component').then(m => m.ExerciseFormComponent)
  }
];