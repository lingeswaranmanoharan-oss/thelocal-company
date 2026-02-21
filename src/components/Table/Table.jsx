/**
 * TableComponent
 * Reusable table component with loading, error, and empty states
 * Similar to the provided pattern
 */

import './Table.scss';
import { apiStatusConditions } from '../../utils/functions';
import { Pagination } from '../Pagination/Pagination';
import TableSkeletonRows from './TableSkeletonRows/TableSkeletonRows';
import { PaginationWithSizeComp } from '../Pagination/PaginationWithPageSize';
import { apiStatusConstants } from '../../utils/enum';

// Table Header Component
const TableHeaders = ({ headers, theadStyles }) => {
  return (
    <thead style={theadStyles}>
      <tr>
        {headers.map((each, index) => {
          if (typeof each === 'boolean') {
            return null;
          } else if ([each?.type?.target, each?.type].includes('th')) {
            return each;
          } else {
            return <th key={index}>{each}</th>;
          }
        })}
      </tr>
    </thead>
  );
};

// Table Row Component
const TableRow = ({ elements, className, color, trStyles, tdStyles }) => (
  <tr className={className || ''} style={{ backgroundColor: color ? color : '', ...trStyles }}>
    {elements.map((each, index) => {
      if (typeof each === 'boolean') {
        return null;
      } else if ([each?.type?.target, each?.type].includes('td')) {
        return each;
      } else {
        return (
          <td key={index} style={{ ...tdStyles }}>
            {each}
          </td>
        );
      }
    })}
  </tr>
);

// Table Loader Component
const TableLoader = ({ colSpan }) => {
  return <TableSkeletonRows columns={colSpan} rows={7} />;
};

// Table Error/Empty State Component
const TableIllusion = ({ noDataText, type, colSpan }) => {
  if (type === 'error') {
    return (
      <tr>
        <td colSpan={colSpan}>
          <p className="text-center">Something went wrong</p>
        </td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td
          colSpan={colSpan}
          style={{
            textAlign: 'center',
          }}
        >
          <div className="flex flex-col items-center justify-center py-12">
            <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
            <p className="text-gray-500">{noDataText || 'No data found'}</p>
          </div>
        </td>
      </tr>
    );
  }
};

// Main Table Component
const TableComponent = (props) => {
  const {
    headers,
    theadStyles,
    apiStatus, // 'INITIAL', 'LOADING', 'SUCCESS', 'FAILURE'
    itemsLength,
    illusionProps = {},
    colSpan,
    containerStyle,
    inititalRow,
    loaderHeight,
    className,
    totalPages,
    currentPage,
    pageSize,
    onPageChange,
    onItemsPerPageChange,
  } = props;

  const getTableRows = () => {
    if (apiStatus === apiStatusConstants.success) {
      if (itemsLength) {
        return props.children;
      } else {
        return <TableIllusion {...illusionProps} type="nd" colSpan={colSpan} />;
      }
    } else if (apiStatus === apiStatusConstants.failure) {
      return <TableIllusion {...illusionProps} colSpan={colSpan} type="error" />;
    } else if (inititalRow && apiStatus === apiStatusConstants.initial) {
      return (
        <tr>
          <td
            colSpan={colSpan}
            style={{
              textAlign: 'center',
            }}
          >
            {inititalRow}
          </td>
        </tr>
      );
    } else {
      return <TableLoader colSpan={colSpan} loaderHeight={loaderHeight} />;
    }
  };

  return (
    <>
      <div
        className={`table-container ${className}`}
        style={{
          ...containerStyle,
        }}
      >
        <table className="w-full">
          <TableHeaders headers={headers} theadStyles={theadStyles} />
          <tbody>{getTableRows()}</tbody>
        </table>
      </div>
      {apiStatus === apiStatusConstants.success && totalPages ? (
        <div className="m-2">
          <PaginationWithSizeComp
            totalPages={totalPages}
            currentPage={parseInt(currentPage || 0)}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onItemsPerPageChange}
          />
        </div>
      ) : null}
    </>
  );
};

export { TableComponent, TableHeaders, TableRow, TableLoader, TableIllusion };
