import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <div class="pagination-container">
        <button
          class="btn btn-secondary"
          [disabled]="currentPage === 1"
          (click)="onPageChange(currentPage - 1)"
        >
          Previous
        </button>

        @for (page of pages; track page) {
          <button
            class="btn"
            [class.btn-primary]="currentPage === page"
            [class.btn-secondary]="currentPage !== page"
            (click)="onPageChange(page)"
          >
            {{ page }}
          </button>
        }

        <button
          class="btn btn-secondary"
          [disabled]="currentPage === totalPages"
          (click)="onPageChange(currentPage + 1)"
        >
          Next
        </button>
      </div>
    }
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 640px) {
      .pagination-container {
        flex-wrap: wrap;
        gap: 0.25rem;
      }

      .pagination-container .btn {
        min-width: 44px;
        padding: 0.5rem 0.75rem;
      }
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalCount = 0;
  @Input() perPage = 10;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.perPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}