import { Icon } from '@iconify/react';
import { Dropdown } from '../Dropdown/Dropdown';
import { ITEMS_PER_PAGE_OPTIONS } from '../../Utils/constants';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS,
  showItemsPerPage = true,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const dropdownItems = itemsPerPageOptions.map((option) => ({
    value: option,
    label: option.toString(),
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 whitespace-nowrap">Row Per Page</span>
            <div className="w-20">
              <Dropdown
                items={dropdownItems}
                selectedValue={itemsPerPage}
                onSelect={(value) => onItemsPerPageChange(value)}
                className="mb-0"
              />
            </div>
            <span className="text-sm text-gray-700 whitespace-nowrap">Entries</span>
          </div>
        )}
        <div className="text-sm text-gray-700 whitespace-nowrap">
          Showing {startItem} - {endItem} of {totalItems} entries
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`p-2 rounded-md border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
          aria-label="Previous page"
        >
          <Icon icon="mdi:chevron-left" className="w-5 h-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`min-w-[2.5rem] px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === page
                ? 'bg-[#f26522] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
          aria-label="Next page"
        >
          <Icon icon="mdi:chevron-right" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
