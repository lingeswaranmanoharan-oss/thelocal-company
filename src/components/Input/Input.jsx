import { useState } from 'react';
import { clsx } from 'clsx';
import { Icon } from '@iconify/react';
import './Input.scss';

export const ErrorMsg = ({ children }) => (
  <div className="mt-1 text-sm text-red-600">{children}</div>
);
export function Input({
  label,
  onChange,
  value,
  error,
  hint,
  className = '',
  id,
  type = 'text',
  rightIcon,
  showPasswordToggle = false,
  showClearButton = false,
  required = false,
  // register,
  ...rest
}) {
  const inputId = id;
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password' && showPasswordToggle;
  const hasValue = value && value.toString().trim().length > 0;
  const showClear = showClearButton && hasValue;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleClear = () => {
    // rest?.onChange?.({
    //   target: { value: '' },
    // });
  };

  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={clsx('input-wrapper', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="input-container">
        <input
          id={inputId}
          type={inputType}
          className={clsx(
            'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#f26522] focus:ring-[#f26522]',
            (rightIcon || isPasswordType || showClear) && 'pr-10',
          )}
          value={value}
          aria-invalid={!!error}
          onChange={(e) => {
            rest?.onChange?.(e);
            onChange && onChange(e);
          }}
          onWheel={type === 'number' ? (e) => e.target.blur() : undefined}
          {...rest}
        />
        {showClear && (
          <span
            className="input-icon clear-icon"
            onClick={handleClear}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClear();
              }
            }}
          >
            <Icon
              icon="mdi:close-circle"
              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            />
          </span>
        )}
        {rightIcon && !showClear && <span className="input-icon right-icon">{rightIcon}</span>}
        {isPasswordType && (
          <span
            className="input-icon password-toggle-icon"
            onClick={handlePasswordToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePasswordToggle();
              }
            }}
          >
            {showPassword ? (
              <Icon icon="mdi:eye-off-outline" className="w-5 h-5 text-gray-500" />
            ) : (
              <Icon icon="mdi:eye-outline" className="w-5 h-5 text-gray-500" />
            )}
          </span>
        )}
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {hint && !error && <div className="mt-1 text-sm text-gray-500">{hint}</div>}
    </div>
  );
}
