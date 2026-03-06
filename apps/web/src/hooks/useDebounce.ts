import { useState, useEffect } from 'react';

/**
 * Debounce a value with a specified delay
 * Useful for search inputs to avoid excessive API calls
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 400ms)
 * @returns The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 400);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search with debouncedSearchTerm
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
