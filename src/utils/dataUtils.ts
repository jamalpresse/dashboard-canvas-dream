
/**
 * Utility functions for handling data safely
 */

/**
 * Safely get a property from an object with a fallback value
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] {
  if (!obj) return fallback;
  return obj[key] !== undefined && obj[key] !== null ? obj[key] : fallback;
}

/**
 * Safely access an array element with a fallback
 */
export function safeArrayGet<T>(arr: T[] | null | undefined, index: number, fallback: T): T {
  if (!arr || !Array.isArray(arr) || index < 0 || index >= arr.length) {
    return fallback;
  }
  return arr[index] !== undefined && arr[index] !== null ? arr[index] : fallback;
}

/**
 * Safely execute a function and return fallback on error
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  onError?: (error: any) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      console.error('Error in async operation:', error);
    }
    return fallback;
  }
}

/**
 * Safely parse JSON
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
}

/**
 * Safe string truncate
 */
export function truncateString(str: string | null | undefined, maxLength: number): string {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

/**
 * Safely create a date string with fallback
 */
export function safeFormatDate(
  dateString: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric' 
  },
  locale: string = 'fr-FR',
  fallback: string = '--/--/----'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Safely checks if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safely checks if an array has items and is valid
 */
export function hasItems<T>(arr: T[] | null | undefined): boolean {
  return Boolean(arr && Array.isArray(arr) && arr.length > 0);
}

/**
 * Creates a safe array from potentially invalid input
 */
export function safeArray<T>(arr: T[] | null | undefined): T[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr;
}

/**
 * Safely access nested objects without throwing
 */
export function safeNested<T>(
  obj: any, 
  path: string, 
  fallback: T
): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === undefined || current === null) return fallback;
      current = current[key];
    }
    
    return current !== undefined && current !== null ? current : fallback;
  } catch (error) {
    console.error('Error accessing nested property:', error);
    return fallback;
  }
}
