import { clsx } from 'clsx';
import './Toggle.scss';

export function Toggle({
  label,
  error,
  hint,
  className = '',
  id,
  required = false,
  disabled = false,
  ...rest
}) {
  const toggleId = id || rest.name;
  //   console.log(rest);

  return (
    <div className={clsx('toggle-wrapper', className)}>
      {label && (
        <label htmlFor={toggleId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-#f26522-500 ml-1">*</span>}
        </label>
      )}

      <label className="toggle-container cursor-pointer">
        <input
          id={toggleId}
          type="checkbox"
          className="toggle-input"
          disabled={disabled}
          aria-invalid={!!error}
          {...rest}
        />
        <span className="toggle-slider" />
      </label>

      {error && <div className="mt-1 text-sm text-#f26522-600">{error}</div>}
      {hint && !error && <div className="mt-1 text-sm text-gray-500">{hint}</div>}
    </div>
  );
}
