import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function Button({
  variant = 'primary',
  size = 'sm',
  children,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#f26522] text-white hover:bg-[#d94a1e] focus:ring-[#f26522]',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
      'border-2 border-[#f26522] text-[#f26522] hover:bg-[#f26522] hover:text-white focus:ring-[#f26522]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-lg',
    default: 'px-4 py-2 text-base',
  };

  return (
    <button
      type={type}
      className={clsx(
        base,
        variants[variant] || variants.primary,
        sizes[size] || sizes.default,
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export const DeleteIconButton = ({ callBackFunction }) => {
  return (
    <IconButton onClick={callBackFunction}>
      <Icon icon="weui:delete-outlined" height={22} />
    </IconButton>
  );
};
export const EditIconButton = ({ callBackFunction, requestedPath }) => {
  if (requestedPath)
    return (
      <Link to={requestedPath}>
        <IconButton>
          <Icon icon="mdi:pencil-outline" color="#ff6e1f" height={22} />
        </IconButton>
      </Link>
    );
  return (
    <IconButton onClick={callBackFunction}>
      <Icon icon="mdi:pencil-outline" color="#555555" height={22} />
    </IconButton>
  );
};
export const ViewIconButton = ({ callBackFunction, requestedPath, style }) => {
  if (requestedPath)
    return (
      <Link to={requestedPath}>
        <IconButton>
          <Icon icon="mdi:eye-outline" color="#f26522" height={22} />
        </IconButton>
      </Link>
    );
  return (
    <IconButton onClick={callBackFunction}>
      <Icon icon="mdi:eye-outline" color="grey" height={22} />
    </IconButton>
  );
};
