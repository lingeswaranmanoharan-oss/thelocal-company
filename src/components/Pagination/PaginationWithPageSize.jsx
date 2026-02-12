import PaginationMUI from '@mui/material/Pagination';
import useRouteInformation from '../../hooks/useRouteInformation';
import { Dropdown } from '../Dropdown/Dropdown';
import { ITEMS_PER_PAGE_OPTIONS } from '../../Utils/constants';

const PaginationComponent = ({ totalPages, pageName, onPageChange, currentPage }) => {
  const { setQueryParams, queryParams } = useRouteInformation();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {totalPages > 0 && (
        <PaginationMUI
          onChange={(_, value) =>
            onPageChange
              ? onPageChange(value - 1)
              : setQueryParams({ [pageName || 'page']: parseInt(value) - 1 })
          }
          page={parseInt(currentPage || (queryParams && queryParams[pageName || 'page']) || 0) + 1}
          shape="rounded"
          count={totalPages}
          sx={{
            '& .MuiPaginationItem-page.Mui-selected': {
              backgroundColor: '#fffff ',
              color: '#ff6e1f',
              '&:hover': {
                backgroundColor: '#ff6e1f',
                color: '#fff',
              },
              border: '1px solid #ff6e1f',
              borderRadius: '20px',
            },
          }}
        />
      )}
    </div>
  );
};

const PageSize = ({ onChangePageSize, pageSize }) => {
  const { queryParams, setQueryParams } = useRouteInformation();
  const handlePageSize = (value) => {
    onChangePageSize
      ? onChangePageSize(value)
      : setQueryParams({
          size: value,
        });
  };
  return (
    <Dropdown
      className="w-[100px] !mb-0"
      items={ITEMS_PER_PAGE_OPTIONS.map((each) => ({ label: each, value: each }))}
      selectedValue={pageSize || queryParams.size || 10}
      onSelect={handlePageSize}
    />
  );
};

const getPaginationText = (page, pageSize, totalItems) => {
  if (totalItems === 0) return 'No entries found';

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return `Showing ${start}-${end} of ${totalItems} entries`;
};

const PaginationWithSizeComp = ({
  onChangePageSize,
  pageSize,
  totalPages,
  pageName,
  onPageChange,
  currentPage,
}) => {
  return (
    <div className="flex items-center">
      {pageSize && <PageSize onChangePageSize={onChangePageSize} pageSize={parseInt(pageSize)} />}{' '}
      {/* <span className="text-sm text-gray-600">
        {getPaginationText(currentPage, pageSize, totalItems)}
      </span> */}
      <PaginationComponent
        totalPages={totalPages}
        pageName={pageName}
        onPageChange={onPageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export { PaginationComponent, PageSize, PaginationWithSizeComp };
