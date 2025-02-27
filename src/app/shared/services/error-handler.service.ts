import { Injectable } from '@angular/core';
import { AppError } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: any, context: string): AppError {
    const appError = AppError.fromError(error);
    
    // Log error with context
    console.error(`Error in ${context}:`, {
      message: appError.message,
      code: appError.code,
      details: appError.details,
      stack: appError.stack
    });

    return appError;
  }
}