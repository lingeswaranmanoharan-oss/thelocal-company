import { useState } from 'react';
import { COMPANY_LOGO_COLORS } from '../../utils/constants';

const sizeMap = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-20 h-20 text-lg',
};

export const CompanyLogo = ({
  logoUrl,
  companyName,
  className = '',
  rounded = 'lg',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return '--';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getLogoColor = (name) => {
    if (!name) return 'bg-gray-400';
    const index = name.charCodeAt(0) % COMPANY_LOGO_COLORS.length;
    return COMPANY_LOGO_COLORS[index];
  };

  const isFull = rounded === 'full';
  const roundedClass = isFull ? 'rounded-full' : 'rounded-lg';
  const baseSize = className ? '' : (sizeMap[size] || sizeMap.md);
  const textSize = className ? '' : (size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-[10px]' : 'text-xs');

  if (!logoUrl || imageError) {
    return (
      <div
        className={`${baseSize} ${roundedClass} ${getLogoColor(companyName)} flex items-center justify-center text-white font-medium flex-shrink-0 ${textSize} ${className}`.trim()}
      >
        {getInitials(companyName)}
      </div>
    );
  }

  return (
    <div
      className={`${baseSize} ${roundedClass} overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center ${className}`.trim()}
    >
      <img
        src={logoUrl}
        alt={companyName ?? ''}
        className={`w-full h-full object-cover ${roundedClass}`}
        onError={() => setImageError(true)}
        style={{ display: 'block' }}
      />
    </div>
  );
};

