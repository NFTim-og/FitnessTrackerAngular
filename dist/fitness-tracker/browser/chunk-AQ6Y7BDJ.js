import {
  BehaviorSubject,
  ɵɵdefineInjectable
} from "./chunk-TOUTZUUN.js";

// src/app/shared/models/error.model.ts
var ErrorSeverity;
(function(ErrorSeverity2) {
  ErrorSeverity2["LOW"] = "low";
  ErrorSeverity2["MEDIUM"] = "medium";
  ErrorSeverity2["HIGH"] = "high";
  ErrorSeverity2["CRITICAL"] = "critical";
})(ErrorSeverity || (ErrorSeverity = {}));
var ErrorCategory;
(function(ErrorCategory2) {
  ErrorCategory2["NETWORK"] = "network";
  ErrorCategory2["AUTHENTICATION"] = "authentication";
  ErrorCategory2["AUTHORIZATION"] = "authorization";
  ErrorCategory2["VALIDATION"] = "validation";
  ErrorCategory2["SERVER"] = "server";
  ErrorCategory2["CLIENT"] = "client";
  ErrorCategory2["UNKNOWN"] = "unknown";
})(ErrorCategory || (ErrorCategory = {}));
var AppError = class _AppError extends Error {
  constructor(message, code, details, severity = ErrorSeverity.MEDIUM, category = ErrorCategory.UNKNOWN) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "AppError";
    this.timestamp = /* @__PURE__ */ new Date();
    this.severity = severity;
    this.category = category;
  }
  static fromError(error) {
    if (error instanceof _AppError) {
      return error;
    }
    if (error?.name === "HttpErrorResponse") {
      return _AppError.fromHttpError(error);
    }
    if (error?.error?.statusCode && error?.error?.message) {
      return new _AppError(error.error.message, `API_ERROR_${error.error.statusCode}`, error.error.stack, _AppError.getSeverityFromStatus(error.error.statusCode), _AppError.getCategoryFromStatus(error.error.statusCode));
    }
    if (error?.status && error?.statusText) {
      return _AppError.fromHttpError(error);
    }
    if (error?.name === "ValidationError" || error?.code === "VALIDATION_ERROR") {
      return new _AppError(error.message || "Validation failed", "VALIDATION_ERROR", error.details, ErrorSeverity.LOW, ErrorCategory.VALIDATION);
    }
    if (error?.name === "NetworkError" || error?.message?.includes("network")) {
      return new _AppError("Network connection error", "NETWORK_ERROR", error, ErrorSeverity.HIGH, ErrorCategory.NETWORK);
    }
    if (error?.code && error?.message) {
      return new _AppError(error.message, error.code, error.details, ErrorSeverity.MEDIUM, ErrorCategory.UNKNOWN);
    }
    return new _AppError(error?.message || "An unexpected error occurred", "UNKNOWN_ERROR", error, ErrorSeverity.MEDIUM, ErrorCategory.UNKNOWN);
  }
  static fromHttpError(error) {
    const status = error.status || 0;
    const message = _AppError.getMessageFromStatus(status, error);
    const code = `HTTP_ERROR_${status}`;
    const severity = _AppError.getSeverityFromStatus(status);
    const category = _AppError.getCategoryFromStatus(status);
    return new _AppError(message, code, error.error, severity, category);
  }
  static getMessageFromStatus(status, error) {
    const statusMessages = {
      0: "Network connection error",
      400: "Bad request - please check your input",
      401: "Authentication required",
      403: "Access denied",
      404: "Resource not found",
      409: "Conflict - resource already exists",
      422: "Validation error",
      429: "Too many requests - please try again later",
      500: "Internal server error",
      502: "Service temporarily unavailable",
      503: "Service unavailable",
      504: "Request timeout"
    };
    return statusMessages[status] || error?.statusText || `HTTP Error ${status}`;
  }
  static getSeverityFromStatus(status) {
    if (status >= 500)
      return ErrorSeverity.CRITICAL;
    if (status >= 400 && status < 500)
      return ErrorSeverity.HIGH;
    if (status >= 300)
      return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }
  static getCategoryFromStatus(status) {
    if (status === 0)
      return ErrorCategory.NETWORK;
    if (status === 401)
      return ErrorCategory.AUTHENTICATION;
    if (status === 403)
      return ErrorCategory.AUTHORIZATION;
    if (status === 400 || status === 422)
      return ErrorCategory.VALIDATION;
    if (status >= 500)
      return ErrorCategory.SERVER;
    if (status >= 400)
      return ErrorCategory.CLIENT;
    return ErrorCategory.UNKNOWN;
  }
  /**
   * Check if this error should be retryable
   */
  isRetryable() {
    const retryableCodes = ["NETWORK_ERROR", "HTTP_ERROR_500", "HTTP_ERROR_502", "HTTP_ERROR_503", "HTTP_ERROR_504"];
    return retryableCodes.includes(this.code || "");
  }
  /**
   * Get a user-friendly description of the error
   */
  getUserDescription() {
    switch (this.category) {
      case ErrorCategory.NETWORK:
        return "Please check your internet connection and try again.";
      case ErrorCategory.AUTHENTICATION:
        return "Please log in to continue.";
      case ErrorCategory.AUTHORIZATION:
        return "You do not have permission to perform this action.";
      case ErrorCategory.VALIDATION:
        return "Please check your input and try again.";
      case ErrorCategory.SERVER:
        return "Server error. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }
};

// src/app/shared/services/error-handler.service.ts
var ErrorHandlerService = class _ErrorHandlerService {
  constructor() {
    this.errorsSubject = new BehaviorSubject([]);
    this.errorIdCounter = 0;
    this.errors$ = this.errorsSubject.asObservable();
  }
  /**
   * Handle an error and optionally show it to the user
   * @param error - The error to handle
   * @param context - Context where the error occurred
   * @param showToUser - Whether to show this error to the user
   * @returns The processed AppError
   */
  handleError(error, context, showToUser = false) {
    const appError = AppError.fromError(error);
    console.error(`Error in ${context}:`, {
      message: appError.message,
      code: appError.code,
      details: appError.details,
      stack: appError.stack
    });
    if (showToUser) {
      this.addErrorNotification(appError, context);
    }
    return appError;
  }
  /**
   * Add an error notification for the user
   * @param error - The AppError to show
   * @param context - Context where the error occurred
   */
  addErrorNotification(error, context) {
    const notification = {
      id: `error_${++this.errorIdCounter}`,
      error,
      context,
      timestamp: /* @__PURE__ */ new Date(),
      dismissed: false
    };
    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, notification]);
    if (!this.isCriticalError(error)) {
      setTimeout(() => {
        this.dismissError(notification.id);
      }, 1e4);
    }
  }
  /**
   * Dismiss an error notification
   * @param errorId - ID of the error to dismiss
   */
  dismissError(errorId) {
    const currentErrors = this.errorsSubject.value;
    const updatedErrors = currentErrors.filter((error) => error.id !== errorId);
    this.errorsSubject.next(updatedErrors);
  }
  /**
   * Clear all error notifications
   */
  clearAllErrors() {
    this.errorsSubject.next([]);
  }
  /**
   * Check if an error is critical and should not auto-dismiss
   * @param error - The AppError to check
   * @returns True if the error is critical
   */
  isCriticalError(error) {
    const criticalCodes = [
      "AUTHENTICATION_ERROR",
      "AUTHORIZATION_ERROR",
      "NETWORK_ERROR",
      "SERVER_ERROR"
    ];
    return criticalCodes.some((code) => error.code?.includes(code));
  }
  /**
   * Get user-friendly error message
   * @param error - The AppError
   * @returns User-friendly message
   */
  getUserFriendlyMessage(error) {
    const messageMap = {
      "HTTP_ERROR_401": "Please log in to continue",
      "HTTP_ERROR_403": "You do not have permission to perform this action",
      "HTTP_ERROR_404": "The requested resource was not found",
      "HTTP_ERROR_500": "Server error. Please try again later",
      "NETWORK_ERROR": "Network connection error. Please check your internet connection",
      "VALIDATION_ERROR": "Please check your input and try again"
    };
    return messageMap[error.code || ""] || error.message || "An unexpected error occurred";
  }
  static {
    this.\u0275fac = function ErrorHandlerService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ErrorHandlerService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorHandlerService, factory: _ErrorHandlerService.\u0275fac, providedIn: "root" });
  }
};

export {
  ErrorSeverity,
  AppError,
  ErrorHandlerService
};
//# sourceMappingURL=chunk-AQ6Y7BDJ.js.map
