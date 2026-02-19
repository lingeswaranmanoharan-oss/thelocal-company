import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import AddHolidayForm from './AddHolidayForm';
import { Button } from '../../../components/Button/Button';
import Popup from '../../../components/Popup/Popup';
import { apiStatusConstants } from '../../../utils/enum';
import { deleteHoliday } from '../services/services';
import {
  apiReducer,
  getCompanyId,
  getDateToDDMMYYYYformat,
  initialState,
} from '../../../utils/functions';
import { TableComponent, TableRow } from '../../../components/Table/Table';
import { Toggle } from '../../../components/Toggle/Toggle';
import { Icon } from '@iconify/react';
import toaster from '../../../services/toasterService';
import DateInput from '../../../components/DateInput/DateInput';
import dayjs from 'dayjs';
import useRouteInformation from '../../../hooks/useRouteInformation';
import apiServices from '../../../services/apiServices';
import apiEndpoints from '../../../services/apiEndPoints';

const Holidays = () => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);
  const [deleteStatus, setDeleteStatus] = useState(apiStatusConstants.initial);

  const [openPopup, setOpenPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const { queryParams, setQueryParams } = useRouteInformation();

  // Memoized fetch function to prevent unnecessary re-renders

  const fetchHolidays = async () => {
    if (!queryParams?.year) return;
    apiServices.getService({
      apiUrl: apiEndpoints.getHolidays(getCompanyId(), {
        year: queryParams?.year||dayjs().year(),
      }),
      apiDispatch,
    });
  };

  useEffect(() => {
    fetchHolidays();
  }, [queryParams?.year]);

  useEffect(() => {
    setQueryParams({ year: dayjs().year()});
  }, []);

 
  const toggleAddEditPopup = () => {
    if (openPopup) setSelectedHoliday(null);
    setOpenPopup(!openPopup);
  };

  const handleEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setOpenPopup(true);
  };

  const handleDeleteClick = (holiday) => {
    setSelectedHoliday(holiday);
    setDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!selectedHoliday) return;

    setDeleteStatus(apiStatusConstants.inProgress);
    try {
      const response = await deleteHoliday(selectedHoliday.id);
      if (response.success) {
        toaster.success(response.message || 'Deleted successfully');
        fetchHolidays(); // Refresh list
        setDeletePopup(false);
      } else {
        toaster.error(response.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || 'Something went wrong';
      toaster.error(errorMsg);
    } finally {
      setDeleteStatus(apiStatusConstants.initial);
      setSelectedHoliday(null);
    }
  };

  const handleYearChange = (date,year) => {
    //console.log(date,year)
   // const year = dayjs(date).year();
    setQueryParams({ year:Number(year) });
  };

  
  // Memoize rows to optimize table rendering performance
  const renderedRows = useMemo(() => {
    if (!apiState?.data) return null;
    
    const orderedRows = [...(apiState?.data?.data)].sort(
      (a, b) => new Date(a.holidayDate) - new Date(b.holidayDate),
    );
  
    return orderedRows?.map((item) => (
      <TableRow
        key={item.id}
        elements={[
          item.holidayName,
          getDateToDDMMYYYYformat(item.holidayDate),
          item.weekdayName,
          `${item.optionalFlag?"Yes":"NO"}`,
          <div className="space-x-2">
            <button
              // className="text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => handleEdit(item)}
              aria-label="Edit Holiday"
            >
              <Icon icon="uil:edit" width="20" />
            </button>
            <button
              // className="text-red-600 hover:text-red-800 transition-colors"
              onClick={() => handleDeleteClick(item)}
              aria-label="Delete Holiday"
            >
              <Icon icon="mi:delete" width="20" />
            </button>
          </div>,
        ]}
      />
    ));
  }, [apiState.data?.data]);


  return (
    <div className="bg-white border rounded-sm flex flex-col items-end">
      <div className="w-full flex justify-between p-3">
        <DateInput
          label="Select Year"
          format="YYYY"
          value={queryParams?.year} // important
          handleChange={handleYearChange}
          views={['year']}
          maxDate={dayjs()}
        />
        
        <Button className="m-3" onClick={toggleAddEditPopup}>
          + Add Holiday
        </Button>
      </div>

      <TableComponent
        headers={['Title', 'Date', 'Day', 'Optional', 'Act']}
        apiState={apiState}
        itemsLength={apiState?.data?.data?.length}
        colSpan={5}
      >
        {renderedRows}
      </TableComponent>

      {/* Add/Edit PopUo */}
      <Popup
        open={openPopup}
        onClose={toggleAddEditPopup}
        header={selectedHoliday ? 'Edit Holiday' : 'Add Holiday'}
        maxWidth="xs"
      >
        <AddHolidayForm
          onClose={toggleAddEditPopup}
          getHolidaysCalender={fetchHolidays}
          editData={selectedHoliday}
          isEditMode={!!selectedHoliday}
        />
      </Popup>

      {/* Delete Confirmation Modal */}
      <Popup
        open={deletePopup}
        onClose={() => setDeletePopup(false)}
        header="Confirm Delete"
        maxWidth="xs"
      >
        <div className="p-5">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-black">{selectedHoliday?.holidayName}</span>? This
            action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletePopup(false)}>
              Cancel
            </Button>
            <Button
              disabled={deleteStatus === apiStatusConstants.inProgress}
              className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
              onClick={confirmDelete}
            >
              {deleteStatus === apiStatusConstants.inProgress ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Holidays;
