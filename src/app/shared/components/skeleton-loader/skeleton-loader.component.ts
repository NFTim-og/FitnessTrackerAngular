import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'text' | 'title' | 'card' | 'avatar' | 'button' | 'image';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse" [ngClass]="containerClasses">
      <!-- Text skeleton -->
      <div 
        *ngIf="type === 'text'" 
        class="bg-gray-300 rounded"
        [ngClass]="textClasses"
      ></div>
      
      <!-- Title skeleton -->
      <div 
        *ngIf="type === 'title'" 
        class="bg-gray-300 rounded"
        [ngClass]="titleClasses"
      ></div>
      
      <!-- Avatar skeleton -->
      <div 
        *ngIf="type === 'avatar'" 
        class="bg-gray-300 rounded-full"
        [ngClass]="avatarClasses"
      ></div>
      
      <!-- Button skeleton -->
      <div 
        *ngIf="type === 'button'" 
        class="bg-gray-300 rounded"
        [ngClass]="buttonClasses"
      ></div>
      
      <!-- Image skeleton -->
      <div 
        *ngIf="type === 'image'" 
        class="bg-gray-300 rounded"
        [ngClass]="imageClasses"
      ></div>
      
      <!-- Card skeleton -->
      <div *ngIf="type === 'card'" class="bg-white rounded-lg shadow p-4 space-y-3">
        <div class="bg-gray-300 rounded h-4 w-3/4"></div>
        <div class="space-y-2">
          <div class="bg-gray-300 rounded h-3 w-full"></div>
          <div class="bg-gray-300 rounded h-3 w-5/6"></div>
          <div class="bg-gray-300 rounded h-3 w-4/6"></div>
        </div>
        <div class="flex space-x-2">
          <div class="bg-gray-300 rounded h-8 w-16"></div>
          <div class="bg-gray-300 rounded h-8 w-16"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
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

  get textClasses(): string {
    const classes = ['h-4'];
    
    if (this.width) {
      classes.push(`w-${this.width}`);
    } else {
      classes.push('w-full');
    }
    
    if (this.height) {
      classes.push(`h-${this.height}`);
    }
    
    return classes.join(' ');
  }

  get titleClasses(): string {
    const classes = ['h-6'];
    
    if (this.width) {
      classes.push(`w-${this.width}`);
    } else {
      classes.push('w-3/4');
    }
    
    if (this.height) {
      classes.push(`h-${this.height}`);
    }
    
    return classes.join(' ');
  }

  get avatarClasses(): string {
    const classes = [];
    
    if (this.width && this.height) {
      classes.push(`w-${this.width}`, `h-${this.height}`);
    } else {
      classes.push('w-10', 'h-10');
    }
    
    return classes.join(' ');
  }

  get buttonClasses(): string {
    const classes = ['h-10'];
    
    if (this.width) {
      classes.push(`w-${this.width}`);
    } else {
      classes.push('w-24');
    }
    
    if (this.height) {
      classes.push(`h-${this.height}`);
    }
    
    return classes.join(' ');
  }

  get imageClasses(): string {
    const classes = [];
    
    if (this.width && this.height) {
      classes.push(`w-${this.width}`, `h-${this.height}`);
    } else {
      classes.push('w-full', 'h-48');
    }
    
    return classes.join(' ');
  }

  get skeletonArray(): number[] {
    return Array(this.count).fill(0);
  }
}
