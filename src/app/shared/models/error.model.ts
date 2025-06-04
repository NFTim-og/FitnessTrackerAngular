export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

export class AppError extends Error {
  public readonly timestamp: Date;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;

  constructor(
    message: string,
    public code?: string,
    public details?: any,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN
  ) {
    super(message);
    this.name = 'AppError';
    this.timestamp = new Date();
    this.severity = severity;
    this.category = category;
  }

  static fromError(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Handle Angular HttpErrorResponse
    if (error?.name === 'HttpErrorResponse') {
      return AppError.fromHttpError(error);
    }

    // Handle Express API errors
    if (error?.error?.statusCode && error?.error?.message) {
      return new AppError(
        error.error.message,
        `API_ERROR_${error.error.statusCode}`,
        error.error.stack,
        AppError.getSeverityFromStatus(error.error.statusCode),
        AppError.getCategoryFromStatus(error.error.statusCode)
      );
    }

    // Handle HTTP errors
    if (error?.status && error?.statusText) {
      return AppError.fromHttpError(error);
    }

    // Handle validation errors
    if (error?.name === 'ValidationError' || error?.code === 'VALIDATION_ERROR') {
      return new AppError(
        error.message || 'Validation failed',
        'VALIDATION_ERROR',
        error.details,
        ErrorSeverity.LOW,
        ErrorCategory.VALIDATION
      );
    }

    // Handle network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return new AppError(
        'Network connection error',
        'NETWORK_ERROR',
        error,
        ErrorSeverity.HIGH,
        ErrorCategory.NETWORK
      );
    }

    // Handle legacy Supabase errors
    if (error?.code && error?.message) {
      return new AppError(
        error.message,
        error.code,
        error.details,
        ErrorSeverity.MEDIUM,
        ErrorCategory.UNKNOWN
      );
    }

    // Handle generic errors
    return new AppError(
      error?.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR',
      error,
      ErrorSeverity.MEDIUM,
      ErrorCategory.UNKNOWN
    );
  }

  private static fromHttpError(error: any): AppError {
    const status = error.status || 0;
    const message = AppError.getMessageFromStatus(status, error);
    const code = `HTTP_ERROR_${status}`;
    const severity = AppError.getSeverityFromStatus(status);
    const category = AppError.getCategoryFromStatus(status);

    return new AppError(message, code, error.error, severity, category);
  }

  private static getMessageFromStatus(status: number, error: any): string {
    const statusMessages: { [key: number]: string } = {
      0: 'Network connection error',
      400: 'Bad request - please check your input',
      401: 'Authentication required',
      403: 'Access denied',
      404: 'Resource not found',
      409: 'Conflict - resource already exists',
      422: 'Validation error',
      429: 'Too many requests - please try again later',
      500: 'Internal server error',
      502: 'Service temporarily unavailable',
      503: 'Service unavailable',
      504: 'Request timeout'
    };

    return statusMessages[status] || error?.statusText || `HTTP Error ${status}`;
  }

  private static getSeverityFromStatus(status: number): ErrorSeverity {
    if (status >= 500) return ErrorSeverity.CRITICAL;
    if (status >= 400 && status < 500) return ErrorSeverity.HIGH;
    if (status >= 300) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }

  private static getCategoryFromStatus(status: number): ErrorCategory {
    if (status === 0) return ErrorCategory.NETWORK;
    if (status === 401) return ErrorCategory.AUTHENTICATION;
    if (status === 403) return ErrorCategory.AUTHORIZATION;
    if (status === 400 || status === 422) return ErrorCategory.VALIDATION;
    if (status >= 500) return ErrorCategory.SERVER;
    if (status >= 400) return ErrorCategory.CLIENT;
    return ErrorCategory.UNKNOWN;
  }

  /**
   * Check if this error should be retryable
   */
  isRetryable(): boolean {
    const retryableCodes = ['NETWORK_ERROR', 'HTTP_ERROR_500', 'HTTP_ERROR_502', 'HTTP_ERROR_503', 'HTTP_ERROR_504'];
    return retryableCodes.includes(this.code || '');
  }

  /**
   * Get a user-friendly description of the error
   */
  getUserDescription(): string {
    switch (this.category) {
      case ErrorCategory.NETWORK:
        return 'Please check your internet connection and try again.';
      case ErrorCategory.AUTHENTICATION:
        return 'Please log in to continue.';
      case ErrorCategory.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorCategory.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorCategory.SERVER:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}