import { toast as sonnerToast } from "sonner";

/**
 * ENHANCED ERROR HANDLING UTILITIES
 * Centralized error handling with toast notifications
 */

// Error types for better categorization
export type ErrorType = 'validation' | 'calculation' | 'file' | 'network' | 'unknown';

// Error severity levels
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Display error message with toast notification
 * @param message - Error message to display
 * @param type - Type of error for context
 * @param severity - Severity level (error, warning, info)
 */
export function showError(
  message: string, 
  type: ErrorType = 'unknown',
  severity: ErrorSeverity = 'error'
) {
  // Log error to console for debugging
  console.error(`[${type.toUpperCase()}]`, message);

  // Show appropriate toast based on severity
  if (severity === 'error') {
    sonnerToast.error(message, {
      description: getErrorDescription(type),
      duration: 5000,
    });
  } else if (severity === 'warning') {
    sonnerToast.warning(message, {
      description: getErrorDescription(type),
      duration: 4000,
    });
  } else {
    sonnerToast.info(message, {
      duration: 3000,
    });
  }
}

/**
 * Display success message with toast notification
 * @param message - Success message to display
 * @param description - Optional description
 */
export function showSuccess(message: string, description?: string) {
  sonnerToast.success(message, {
    description,
    duration: 3000,
  });
}

/**
 * Display info message with toast notification
 * @param message - Info message to display
 * @param description - Optional description
 */
export function showInfo(message: string, description?: string) {
  sonnerToast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * Get contextual error description based on error type
 */
function getErrorDescription(type: ErrorType): string {
  switch (type) {
    case 'validation':
      return 'Please check your input and try again.';
    case 'calculation':
      return 'Unable to perform calculation with provided data.';
    case 'file':
      return 'There was a problem reading the file.';
    case 'network':
      return 'Network request failed. Please check your connection.';
    default:
      return 'An unexpected error occurred.';
  }
}

/**
 * Validate numerical data input
 * Throws descriptive errors for invalid input
 */
export function validateNumericalData(
  data: number[],
  minLength: number = 1,
  fieldName: string = "Data"
): void {
  // Check if data exists
  if (!data || !Array.isArray(data)) {
    throw new Error(`${fieldName} must be an array of numbers.`);
  }

  // Check minimum length
  if (data.length < minLength) {
    throw new Error(
      `${fieldName} must contain at least ${minLength} value${minLength > 1 ? 's' : ''}. Found ${data.length}.`
    );
  }

  // Check for NaN or infinite values
  const invalidCount = data.filter(n => !isFinite(n)).length;
  if (invalidCount > 0) {
    throw new Error(
      `${fieldName} contains ${invalidCount} invalid number${invalidCount > 1 ? 's' : ''} (NaN or Infinity).`
    );
  }
}

/**
 * Validate that two arrays have the same length
 */
export function validateArrayLengths(
  array1: number[],
  array2: number[],
  name1: string = "First array",
  name2: string = "Second array"
): void {
  if (array1.length !== array2.length) {
    throw new Error(
      `${name1} and ${name2} must have the same length. ` +
      `Found ${array1.length} and ${array2.length}.`
    );
  }
}

/**
 * Validate that a value is within a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = "Value"
): void {
  if (value < min || value > max) {
    throw new Error(
      `${fieldName} must be between ${min} and ${max}. Found ${value}.`
    );
  }
}

/**
 * Safe wrapper for statistical calculations
 * Catches errors and displays user-friendly messages
 */
export async function safeCalculation<T>(
  calculation: () => T | Promise<T>,
  errorMessage: string = "Calculation failed"
): Promise<T | null> {
  try {
    return await calculation();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showError(`${errorMessage}: ${message}`, 'calculation');
    return null;
  }
}

/**
 * Parse CSV/text input into number array with validation
 */
export function parseNumericInput(
  input: string,
  fieldName: string = "Input"
): number[] {
  if (!input || input.trim() === '') {
    throw new Error(`${fieldName} cannot be empty.`);
  }

  // Split by various delimiters
  const values = input
    .split(/[,\s\n\t]+/)
    .map(s => s.trim())
    .filter(s => s !== '');

  if (values.length === 0) {
    throw new Error(`${fieldName} contains no valid values.`);
  }

  const numbers: number[] = [];
  const errors: string[] = [];

  values.forEach((val, idx) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      errors.push(`"${val}" at position ${idx + 1}`);
    } else {
      numbers.push(num);
    }
  });

  if (errors.length > 0) {
    const errorSample = errors.slice(0, 3).join(', ');
    const moreText = errors.length > 3 ? ` and ${errors.length - 3} more` : '';
    throw new Error(
      `${fieldName} contains invalid numbers: ${errorSample}${moreText}`
    );
  }

  return numbers;
}

/**
 * Format error messages for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
