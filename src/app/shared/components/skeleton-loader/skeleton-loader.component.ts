import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'text' | 'title' | 'card' | 'avatar' | 'button' | 'image';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container animate-pulse" [ngClass]="containerClasses">
      <!-- Text skeleton -->
      <div
        *ngIf="type === 'text'"
        class="skeleton-element skeleton-text"
        [style.width]="width || '100%'"
        [style.height]="height || '1rem'"
      ></div>

      <!-- Title skeleton -->
      <div
        *ngIf="type === 'title'"
        class="skeleton-element skeleton-title"
        [style.width]="width || '75%'"
        [style.height]="height || '1.5rem'"
      ></div>

      <!-- Avatar skeleton -->
      <div
        *ngIf="type === 'avatar'"
        class="skeleton-element skeleton-avatar"
        [style.width]="width || '2.5rem'"
        [style.height]="height || '2.5rem'"
      ></div>

      <!-- Button skeleton -->
      <div
        *ngIf="type === 'button'"
        class="skeleton-element skeleton-button"
        [style.width]="width || '6rem'"
        [style.height]="height || '2.5rem'"
      ></div>

      <!-- Image skeleton -->
      <div
        *ngIf="type === 'image'"
        class="skeleton-element skeleton-image"
        [style.width]="width || '100%'"
        [style.height]="height || '12rem'"
      ></div>

      <!-- Card skeleton -->
      <div *ngIf="type === 'card'" class="skeleton-card">
        <div class="skeleton-element skeleton-card-title"></div>
        <div class="skeleton-card-content">
          <div class="skeleton-element skeleton-card-line"></div>
          <div class="skeleton-element skeleton-card-line skeleton-card-line-short"></div>
          <div class="skeleton-element skeleton-card-line skeleton-card-line-shorter"></div>
        </div>
        <div class="skeleton-card-actions">
          <div class="skeleton-element skeleton-card-button"></div>
          <div class="skeleton-element skeleton-card-button"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      display: block;
    }

    .skeleton-element {
      background-color: var(--border-color);
      border-radius: var(--radius-md);
      display: block;
    }

    .skeleton-text {
      height: 1rem;
      width: 100%;
    }

    .skeleton-title {
      height: 1.5rem;
      width: 75%;
    }

    .skeleton-avatar {
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
    }

    .skeleton-button {
      height: 2.5rem;
      width: 6rem;
    }

    .skeleton-image {
      height: 12rem;
      width: 100%;
    }

    .skeleton-card {
      background: var(--card-background);
      border-radius: var(--radius-lg);
      padding: 1rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .skeleton-card-title {
      height: 1rem;
      width: 75%;
      margin-bottom: 0.75rem;
    }

    .skeleton-card-content {
      margin-bottom: 0.75rem;
    }

    .skeleton-card-line {
      height: 0.75rem;
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .skeleton-card-line-short {
      width: 83.333333%;
    }

    .skeleton-card-line-shorter {
      width: 66.666667%;
    }

    .skeleton-card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .skeleton-card-button {
      height: 2rem;
      width: 4rem;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Dark mode support */
    :root.dark-mode .skeleton-element {
      background-color: var(--border-light);
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'text';
  @Input() width?: string;
  @Input() height?: string;
  @Input() count: number = 1;
  @Input() className?: string;

  get containerClasses(): string {
    const classes = [];

    if (this.className) {
      classes.push(this.className);
    }

    return classes.join(' ');
  }

  get skeletonArray(): number[] {
    return Array(this.count).fill(0);
  }
}
