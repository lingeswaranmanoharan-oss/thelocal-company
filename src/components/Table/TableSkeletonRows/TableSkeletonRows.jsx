import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const TableSkeletonRows = ({ rows = 10, columns = 8, showStickyColumn = false }) => {
  if (!rows || rows === 0) return null;

  return (
    <SkeletonTheme baseColor="#d1d5db" highlightColor="#e5e7eb">
      {[...Array(rows)].map((_, index) => (
        <tr key={index} className="p-0">
          {showStickyColumn && (
            <td className="sticky left-0 z-10 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.1)] px-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Skeleton width={32} height={32} borderRadius={8} />
                <div className="flex flex-col gap-1">
                  <Skeleton width={96} height={12} />
                  <Skeleton width={128} height={12} />
                </div>
              </div>
            </td>
          )}
          {columns >= 1 && !showStickyColumn && (
            <td className="sticky left-0 z-10 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.1)] px-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Skeleton width={32} height={32} borderRadius={8} />
                <div className="flex flex-col gap-1">
                  <Skeleton width={96} height={12} />
                  <Skeleton width={128} height={12} />
                </div>
              </div>
            </td>
          )}
          {columns >= 2 && (
            <td className="px-4 whitespace-nowrap">
              <div className="flex flex-col gap-1">
                <Skeleton width={128} height={12} />
                <Skeleton width={96} height={12} />
              </div>
            </td>
          )}
          {columns >= 3 && (
            <td className="px-4 whitespace-nowrap">
              <Skeleton width={112} height={12} />
            </td>
          )}
          {columns >= 4 && (
            <td className="px-4 whitespace-nowrap">
              <div className="flex flex-col gap-1">
                <Skeleton width={128} height={12} />
                <Skeleton width={96} height={12} />
              </div>
            </td>
          )}
          {columns >= 5 && (
            <td className="px-4 whitespace-nowrap">
              <Skeleton width={64} height={12} />
            </td>
          )}
          {columns >= 6 && (
            <td className="px-4 whitespace-nowrap">
              <Skeleton width={80} height={12} />
            </td>
          )}
          {columns >= 7 && (
            <td className="px-4 whitespace-nowrap">
              <Skeleton width={40} height={20} borderRadius={9999} />
            </td>
          )}
          {columns >= 8 && (
            <td className="px-4 whitespace-nowrap text-right">
              <div className="flex items-center justify-end gap-2">
                <Skeleton width={24} height={24} circle />
                <Skeleton width={24} height={24} circle />
              </div>
            </td>
          )}
        </tr>
      ))}
    </SkeletonTheme>
  );
};

export default TableSkeletonRows;
