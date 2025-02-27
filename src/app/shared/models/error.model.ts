export class AppError extends Error {
    constructor(
      message: string,
      public code?: string,
      public details?: any
    ) {
      super(message);
      this.name = 'AppError';
    }
  
    static fromError(error: any): AppError {
      if (error instanceof AppError) {
        return error;
      }
  
      // Handle Supabase errors
      if (error?.code && error?.message) {
        return new AppError(error.message, error.code, error.details);
      }
  
      // Handle generic errors
      return new AppError(
        error?.message || 'An unexpected error occurred',
        'UNKNOWN_ERROR'
      );
    }
  }