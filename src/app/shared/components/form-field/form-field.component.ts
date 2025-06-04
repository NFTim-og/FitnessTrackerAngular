import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-field">
      <label 
        *ngIf="label" 
        [for]="fieldId" 
        class="block text-sm font-medium text-gray-700 mb-1"
        [class.text-red-700]="hasError"
      >
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <div class="relative">
        <input
          [id]="fieldId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors"
          [class]="inputClasses"
          [attr.aria-describedby]="hasError ? fieldId + '-error' : null"
          [attr.aria-invalid]="hasError"
        />
        
        <!-- Loading spinner -->
        <div 
          *ngIf="loading" 
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <div class="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
        
        <!-- Success icon -->
        <div 
          *ngIf="showSuccess && !hasError && value && !loading" 
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <!-- Error icon -->
        <div 
          *ngIf="hasError" 
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
      </div>
      
      <!-- Help text -->
      <p 
        *ngIf="helpText && !hasError" 
        class="mt-1 text-sm text-gray-500"
      >
        {{ helpText }}
      </p>
      
      <!-- Error message -->
      <p 
        *ngIf="hasError" 
        [id]="fieldId + '-error'"
        class="mt-1 text-sm text-red-600"
        role="alert"
      >
        {{ errorMessage }}
      </p>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1rem;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: InputType = 'text';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() loading: boolean = false;
  @Input() showSuccess: boolean = true;
  @Input() helpText?: string;
  @Input() control?: AbstractControl | null;
  @Input() fieldName?: string;

  value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Generate unique field ID
  fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;

  get hasError(): boolean {
    return !!(this.control && this.control.errors && this.control.touched);
  }

  get errorMessage(): string | null {
    if (!this.hasError || !this.control || !this.fieldName) {
      return null;
    }
    
    return ValidationService.getFirstErrorMessage(this.fieldName, this.control);
  }

  get inputClasses(): string {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors';
    
    if (this.hasError) {
      return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    
    if (this.showSuccess && this.value && !this.loading && this.control?.valid) {
      return `${baseClasses} border-green-300 text-green-900 focus:ring-green-500 focus:border-green-500`;
    }
    
    if (this.disabled) {
      return `${baseClasses} border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(): void {
    // Optional: Handle focus events
  }
}
