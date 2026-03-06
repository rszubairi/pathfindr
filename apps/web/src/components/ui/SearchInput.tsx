'use client';

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch: (value: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
}

export function SearchInput({
  onSearch,
  debounceMs = 400,
  showClearButton = true,
  className,
  placeholder = 'Search...',
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, debounceMs);

  // Call onSearch when debounced value changes
  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          'w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'placeholder:text-gray-400',
          className
        )}
        placeholder={placeholder}
        {...props}
      />

      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
