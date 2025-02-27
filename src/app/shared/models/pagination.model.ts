export class PaginationState {
    currentPage: number;
    totalCount: number;
    perPage: number;
  
    constructor(data: Partial<PaginationState> = {}) {
      this.currentPage = data.currentPage || 1;
      this.totalCount = data.totalCount || 0;
      this.perPage = data.perPage || 10;
    }
  
    get totalPages(): number {
      return Math.ceil(this.totalCount / this.perPage);
    }
  
    get startIndex(): number {
      return (this.currentPage - 1) * this.perPage;
    }
  
    get endIndex(): number {
      return this.startIndex + this.perPage - 1;
    }
  }
  
  export class PaginationParams {
    page: number;
    perPage: number;
  
    constructor(data: Partial<PaginationParams> = {}) {
      this.page = data.page || 1;
      this.perPage = data.perPage || 10;
    }
  }
  
  export class PaginationResponse<T> {
    data: T[];
    totalCount: number;
  
    constructor(data: T[], totalCount: number) {
      this.data = data;
      this.totalCount = totalCount;
    }
  }