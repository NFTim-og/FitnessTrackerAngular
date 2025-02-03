export interface PaginationState {
    currentPage: number;
    totalCount: number;
    perPage: number;
  }
  
  export interface PaginationResponse<T> {
    data: T[];
    totalCount: number;
  }
  
  export interface PaginationParams {
    page: number;
    perPage: number;
  }