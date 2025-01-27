import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to Fitness Tracker</h1>
        <p class="text-xl mb-8">Track your workouts, achieve your goals.</p>
        
        <div class="flex justify-center gap-4">
          <a routerLink="/exercises" class="btn btn-primary">View Exercises</a>
          <a routerLink="/workout-plans" class="btn btn-primary">Workout Plans</a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}