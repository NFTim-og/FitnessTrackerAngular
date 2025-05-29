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

      // Handle Express API errors
      if (error?.error?.statusCode && error?.error?.message) {
        return new AppError(
          error.error.message,
          `API_ERROR_${error.error.statusCode}`,
          error.error.stack
        );
      }

      // Handle HTTP errors
      if (error?.status && error?.statusText) {
        return new AppError(
          error.statusText,
          `HTTP_ERROR_${error.status}`,
          error.error
        );
      }

      // Handle legacy Supabase errors
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