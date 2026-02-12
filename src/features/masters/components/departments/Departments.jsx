import React, { useEffect, useMemo, useReducer, useState } from 'react';
import DepartmentForm from './DepartmentForm';
import { apiReducer, initialState } from '../../../../utils/functions';

import { getDepartments } from '../../../employee/services/services';
import { Button } from '../../../../components/Button/Button';
import { TableComponent, TableRow } from '../../../../components/Table/Table';
import Popup from '../../../../components/Popup/Popup';
import { apiStatusConstants } from '../../../../utils/enum';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { updateDepartmentStatus } from '../../services/services';
import toaster from '../../../../services/toasterService';

const EachRow = React.memo(({ each, getDepts }) => {
  const [checked, setChecked] = useState(each.activeFlag === 'Y');

  const handleToggle = async (e) => {
    const { id, checked } = e.target;
    setChecked(checked);
    // console.log(id,checked)

    const updatedBody = { ...each, activeFlag: checked ? 'Y' : 'N' };
    //console.log(updatedBody)

    try {
      const response = await updateDepartmentStatus(updatedBody, id);
      if (response.success) {
        console.log(response);
        toaster.success(response?.message);
        getDepts();
      } else {
        toaster.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toaster.error('something wrong');
    }
  };

  return (
    <TableRow
      elements={[
        each.departmentName,
        <Toggle id={each.id} checked={checked} onChange={handleToggle} />,
      ]}
    />
  );
});

const Departments = () => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);

  const [openPopup, setOpenPopup] = useState(false);

  const handlePopup = () => setOpenPopup((prev) => !prev);

  const getDepts = async () => {
    try {
      apiDispatch({
        apiStatus: apiStatusConstants.inProgress,
      });
      const response = await getDepartments();
      if (response.success === true) {
        apiDispatch({
          apiStatus: apiStatusConstants.success,
          payload: response?.data,
        });
        console.log(response?.data);
      } else {
        apiDispatch({
          apiStatus: apiStatusConstants.failure,
          payload: response?.data,
        });
      }
    } catch (e) {
      apiDispatch({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  const sortedData = useMemo(() => {
    return [...(apiState?.data || [])].sort((a, b) =>
      a.activeFlag === b.activeFlag ? 0 : a.activeFlag === 'Y' ? -1 : 1,
    );
  }, [apiState?.data]);

  const getRows = () => {
    return sortedData?.map((row) => <EachRow each={row} key={row.id} getDepts={getDepts} />);
  };

  useEffect(() => {
    getDepts();
  }, []);

  return (
    <div className="bg-white border flex flex-col items-end">
      <Button className="m-3" onClick={handlePopup}>
        + Add Department
      </Button>

      <TableComponent
        headers={['Department Name', 'Status']}
        apiState={apiState}
        itemsLength={apiState?.data?.length}
        colSpan={2}
      >
        {getRows()}
      </TableComponent>

      <Popup open={openPopup} onClose={handlePopup} header="Add Department">
        <DepartmentForm getDepts={getDepts} onClose={handlePopup} />
      </Popup>
    </div>
  );
};

export default Departments;
