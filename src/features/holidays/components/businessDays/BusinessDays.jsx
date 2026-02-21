import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import DateInput from '../../../../components/DateInput/DateInput';
import { Button } from '../../../../components/Button/Button';
import Popup from '../../../../components/Popup/Popup';
import AddBusinessDays from './AddBusinessDays';
import { apiReducer, getCompanyId, initialState } from '../../../../utils/functions';
import apiServices from '../../../../services/apiServices';
import apiEndpoints from '../../../../services/apiEndPoints';
import { TableComponent, TableRow } from '../../../../components/Table/Table';
import { Icon } from '@iconify/react';
import { deleteBusinessDays } from '../../services/services';
import { apiStatusConstants } from '../../../../utils/enum';
import toaster from '../../../../services/toasterService';
import useRouteInformation from '../../../../hooks/useRouteInformation';

const MONTHS = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const getMonthName = (value) => {
  return MONTHS.find((month) => month.value === value).label;
};

const BusinessDays = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);
  const [businessDay, setBusinessDay] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(apiStatusConstants.initial);
  const { queryParams, setQueryParams } = useRouteInformation();

  const toggleAddEditPopup = () => {
    if (openPopup) {
      setTimeout(() => {
        setBusinessDay(null);
      }, 100);
    }
    setOpenPopup(!openPopup);
  };

  const handleEdit = (businessDay) => {
    console.log(businessDay);
    setBusinessDay(businessDay);
    setOpenPopup(true);
  };

  const handleDeleteClick = (businessDay) => {
    setBusinessDay(businessDay);
    setDeletePopup(true);
  };

  const getBusinessDays = async () => {
    apiServices.getService({
      apiUrl: apiEndpoints.getBusinessDays(getCompanyId(), {
        year: queryParams?.year || dayjs().year(),
      }),
      apiDispatch,
    });
  };

  const confirmDelete = async () => {
    if (!businessDay) return;
    console.log(businessDay);
    setDeleteStatus(apiStatusConstants.inProgress);
    try {
      const response = await deleteBusinessDays(businessDay.id);
      if (response.success) {
        toaster.success(response.message || 'Deleted successfully');
        getBusinessDays();
        setDeletePopup(false);
      } else {
        toaster.error(response.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || 'Something went wrong';
      toaster.error(errorMsg);
    } finally {
      setDeleteStatus(apiStatusConstants.initial);
      setBusinessDay(null);
    }
  };

  const handleYearChange = (date, year) => {
    //console.log(date,year)
    // const year = dayjs(date).year();
    setQueryParams({ year: Number(year) });
  };

  useEffect(() => {
    getBusinessDays();
  }, [queryParams?.year]);

  useEffect(() => {
    if (!queryParams?.year) {
      setQueryParams({ year: dayjs().year() });
    }
  }, [queryParams?.year]);

  const renderedRows = React.useMemo(() => {

    const sortedData=[...(apiState?.data?.data||[])].sort((a,b)=>a.month-b.month)

    return sortedData?.map((each, index) => {
      return (
        <EachRow
          each={each}
          key={each.id}
          index={index}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      );
    });
  },[apiState?.data?.data]);

  return (
    <div className="bg-white border rounded-md flex flex-col items-end">
      <div className="w-full flex justify-between p-3">
        <DateInput
          label="Select Year"
          format="YYYY"
          value={queryParams?.year}
          handleChange={handleYearChange}
          views={['year']}
           maxDate={dayjs()}
        />

        <Button className="m-3" onClick={toggleAddEditPopup}>
          + Add Business Days
        </Button>
      </div>

      <TableComponent
        headers={['S.No', 'MOnth', 'year', 'working days', 'act']}
        apiStatus={apiState?.apiStatus}
        colSpan={4}
        itemsLength={apiState?.data?.data?.length}
        containerStyle={{ maxHeight: '70vh', scrollbarWidth: 'none' }}
      >
        {renderedRows}
      </TableComponent>

      <Popup
        open={openPopup}
        maxWidth="xs"
        header={businessDay ? 'Edit Business Days' : 'Add Business Days'}
        onClose={toggleAddEditPopup}
      >
        <AddBusinessDays
          months={MONTHS}
          onClose={toggleAddEditPopup}
          getBusinessDays={getBusinessDays}
          editData={businessDay}
          isEditMode={!!businessDay}
        />
      </Popup>

      {/* Delete Confirmation Modal */}
      <Popup
        open={deletePopup}
        onClose={() => setDeletePopup(false)}
        header="Confirm Delete"
        maxWidth="xs"
        footer={
          <div className="flex  gap-3">
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
        }
      >
        <div className="p-5">
          <p className="text-gray-600 ">
            Are you sure you want to delete this ? action cannot be undone.
          </p>
        </div>
      </Popup>
    </div>
  );
};

export default BusinessDays;

const EachRow = ({ each, index, onEdit, onDelete }) => {
  return (
    <TableRow
      elements={[
        index + 1,
        getMonthName(each.month),
        each.year,
        each.workingDays,
        <div className="space-x-2">
          <button onClick={() => onEdit(each)} aria-label="Edit businessdays">
            <Icon icon="uil:edit" width="20" />
          </button>
          <button onClick={() => onDelete(each)} aria-label="Delete businessdays">
            <Icon icon="mi:delete" width="20" />
          </button>
        </div>,
      ]}
    />
  );
};
