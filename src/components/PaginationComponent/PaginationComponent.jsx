import useRouteInformation from '../../utils/useRouterInformation';
import PaginationMUI from '@mui/material/Pagination';

const PaginationComponent = ({ totalPages, pageName, callBackFunction, currentPage }) => {
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
            callBackFunction
              ? callBackFunction(value - 1)
              : setQueryParams({ [pageName || 'page']: parseInt(value) - 1 })
          }
          page={parseInt(currentPage || (queryParams && queryParams[pageName || 'page']) || 0) + 1}
          shape="rounded"
          count={totalPages}
          sx={{
            '& .MuiPaginationItem-page.Mui-selected': {
              backgroundColor: '#fffff ',
              color: '#dc2626',
              '&:hover': {
                backgroundColor: '#dc2626',
                color: '#fff',
              },
              border: '1px solid #dc2626',
              borderRadius: '20px',
            },
          }}
        />
      )}
    </div>
  );
};

export default PaginationComponent;
