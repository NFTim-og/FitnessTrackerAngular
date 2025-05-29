/**
 * Custom error class for API errors
 */
class AppError extends Error {
  /**
   * Create a new AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create an AppError from another error
   * @param {Error} error - Original error
   * @returns {AppError} - New AppError
   */
  static fromError(error) {
    const appError = new AppError(
      error.message || 'Something went wrong',
      error.statusCode || 500
    );
    appError.stack = error.stack;
    return appError;
  }
}

module.exports = AppError;
