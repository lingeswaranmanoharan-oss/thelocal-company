import { useRef, useEffect, useState, useId } from 'react';
import { clsx } from 'clsx';

export function Dropdown({
  label,
  items = [],
  selectedValue,
  onSelect,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  id: propId,
  error,
  hint,
  isLoading = false,
}) {
  const generatedId = useId();
  const id = propId ?? generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayText = selectedItem?.label ?? placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className={clsx('mb-4 relative', className)} ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        onClick={() => !disabled && !isLoading && setIsOpen((p) => !p)}
        disabled={disabled || isLoading}
        className={clsx(
          'relative w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm',
          'flex items-center justify-between',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-[#f26522] focus:ring-[#f26522]',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed bg-gray-50',
          isOpen && !error && 'border-[#f26522] ring-1 ring-[#f26522]',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={!!error}
      >
        <span className={clsx('block truncate', !selectedItem && 'text-gray-500')}>
          {displayText}
        </span>

        {/* Loader / Arrow */}
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          <svg
            className={clsx(
              'h-5 w-5 text-gray-400 transition-transform duration-200',
              isOpen && 'transform rotate-180',
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm"
          role="listbox"
          aria-labelledby={id}
        >
          {isLoading ? (
            <li className="py-2 px-3 text-gray-500 text-sm flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
              Loading...
            </li>
          ) : items.length === 0 ? (
            <li className="py-2 px-3 text-gray-500 text-sm">No options</li>
          ) : (
            items.map((item) => (
              <li
                key={item.value}
                role="option"
                aria-selected={selectedValue === item.value}
                className={clsx(
                  'relative cursor-pointer select-none py-2 pl-3 pr-9',
                  selectedValue === item.value
                    ? 'bg-[#f26522] text-white'
                    : 'text-gray-900 hover:bg-gray-50',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                )}
                onClick={() => !item.disabled && handleSelect(item.value)}
              >
                <span className="block truncate font-normal">{item.label}</span>

                {selectedValue === item.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}

      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {hint && !error && <div className="mt-1 text-sm text-gray-500">{hint}</div>}
    </div>
  );
}
