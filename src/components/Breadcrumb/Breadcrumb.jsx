import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

export const Breadcrumb = () => {
  const breadcrumbs = useSelector((state) => state.breadcrumbs);

  if (!breadcrumbs?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-gray-500">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.path || index} className="flex items-center">
              {index > 0 && (
                <Icon icon="mdi:chevron-right" className="mx-2 h-4 w-4 text-gray-400" />
              )}
              {item.icon && (
                <Link
                  to={item.path}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Icon icon={item.icon} className="mr-1 h-4 w-4" />
                </Link>
              )}
              {isLast ? (
                <span className="font-medium text-gray-800">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-gray-700 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
