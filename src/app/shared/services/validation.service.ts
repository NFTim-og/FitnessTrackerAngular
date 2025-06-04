import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validation Service
 * Provides custom validators and validation utilities for forms
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * Email validation pattern
   */
  static readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Password validation pattern (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
   */
  static readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  /**
   * Validate email format
   */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values (use required validator for that)
      }
      
      const valid = ValidationService.EMAIL_PATTERN.test(control.value);
      return valid ? null : { email: { value: control.value } };
    };
  }

  /**
   * Validate password strength
   */
  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value;
      const errors: any = {};

      if (value.length < 8) {
        errors.minLength = { requiredLength: 8, actualLength: value.length };
      }

      if (!/[a-z]/.test(value)) {
        errors.lowercase = true;
      }

      if (!/[A-Z]/.test(value)) {
        errors.uppercase = true;
      }

      if (!/\d/.test(value)) {
        errors.number = true;
      }

      return Object.keys(errors).length ? { password: errors } : null;
    };
  }

  /**
   * Validate that passwords match
   */
  static passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        // Clear the error if passwords match
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
        }
        return null;
      }
    };
  }

  /**
   * Validate positive number
   */
  static positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = parseFloat(control.value);
      return value > 0 ? null : { positiveNumber: { value: control.value } };
    };
  }

  /**
   * Validate number range
   */
  static rangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = parseFloat(control.value);
      if (isNaN(value)) {
        return { range: { value: control.value, min, max } };
      }

      if (value < min || value > max) {
        return { range: { value, min, max } };
      }

      return null;
    };
  }

  /**
   * Validate minimum length for strings
   */
  static minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value.toString();
      return value.length >= minLength ? null : { 
        minLength: { requiredLength: minLength, actualLength: value.length } 
      };
    };
  }

  /**
   * Validate maximum length for strings
   */
  static maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value.toString();
      return value.length <= maxLength ? null : { 
        maxLength: { requiredLength: maxLength, actualLength: value.length } 
      };
    };
  }

  /**
   * Validate that a value is one of the allowed options
   */
  static optionsValidator(allowedOptions: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valid = allowedOptions.includes(control.value);
      return valid ? null : { options: { value: control.value, allowedOptions } };
    };
  }

  /**
   * Get user-friendly error message for validation errors
   */
  static getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    if (errors['required']) {
      return `${fieldName} is required`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['password']) {
      const passwordErrors = errors['password'];
      const messages = [];
      
      if (passwordErrors.minLength) {
        messages.push(`at least ${passwordErrors.minLength.requiredLength} characters`);
      }
      if (passwordErrors.lowercase) {
        messages.push('one lowercase letter');
      }
      if (passwordErrors.uppercase) {
        messages.push('one uppercase letter');
      }
      if (passwordErrors.number) {
        messages.push('one number');
      }
      
      return `Password must contain ${messages.join(', ')}`;
    }

    if (errors['passwordMismatch']) {
      return 'Passwords do not match';
    }

    if (errors['positiveNumber']) {
      return `${fieldName} must be a positive number`;
    }

    if (errors['range']) {
      const { min, max } = errors['range'];
      return `${fieldName} must be between ${min} and ${max}`;
    }

    if (errors['minLength']) {
      const { requiredLength } = errors['minLength'];
      return `${fieldName} must be at least ${requiredLength} characters long`;
    }

    if (errors['maxLength']) {
      const { requiredLength } = errors['maxLength'];
      return `${fieldName} must be no more than ${requiredLength} characters long`;
    }

    if (errors['options']) {
      const { allowedOptions } = errors['options'];
      return `${fieldName} must be one of: ${allowedOptions.join(', ')}`;
    }

    // Generic error message
    return `${fieldName} is invalid`;
  }

  /**
   * Check if a form control has a specific error
   */
  static hasError(control: AbstractControl | null, errorType: string): boolean {
    return !!(control && control.errors && control.errors[errorType] && control.touched);
  }

  /**
   * Get the first error message for a form control
   */
  static getFirstErrorMessage(fieldName: string, control: AbstractControl | null): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    return ValidationService.getErrorMessage(fieldName, control.errors);
  }
}
