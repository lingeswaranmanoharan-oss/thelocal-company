import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { getEmployeTypes } from '../../../employee/services/services';
import { apiReducer, initialState } from '../../../../utils/functions';
import { Button } from '../../../../components/Button/Button';
import { TableComponent, TableRow } from '../../../../components/Table/Table';
import Popup from '../../../../components/Popup/Popup';
import EmployementTypeForm from './EmployementTypeForm';
import { apiStatusConstants } from '../../../../utils/enum';
import { updateEmployementTypeStatus } from '../../services/services';
import toaster from '../../../../services/toasterService';
import { Toggle } from '../../../../components/Toggle/Toggle';

const EachRow = React.memo(({ each, onToggle }) => {
  const [checked, setChecked] = useState(each.activeFlag === 'Y');

  const handleToggle = async (e) => {
    const { id, checked } = e.target;
    setChecked(checked);
    // console.log(id,checked)

    const updatedBody = { ...each, activeFlag: checked ? 'Y' : 'N' };
    //console.log(updatedBody)
    await onToggle(updatedBody, id);
  };

  return (
    <TableRow
      elements={[
        each.typeName,
        each.itCode,
        <Toggle id={each.id} checked={checked} onChange={handleToggle} />,
      ]}
    />
  );
});

const EmployementTypes = () => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);
  const [openPopup, setOpenPopup] = useState(false);

  const handlePopup = () => setOpenPopup((prev) => !prev);

  const getEmployementTypes = async () => {
    try {
      apiDispatch({
        apiStatus: apiStatusConstants.inProgress,
      });
      const response = await getEmployeTypes();
      if (response.success === true) {
        apiDispatch({
          apiStatus: apiStatusConstants.success,
          payload: response?.data,
        });
        //console.log(response?.data);
      } else {
        apiDispatch({
          apiStatus: apiStatusConstants.failure,
          payload: response?.data,
        });
      }
    } catch (error) {
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
    return sortedData?.map((row) => (
      <EachRow key={row.id} each={row} onToggle={updateEmployementType} />
    ));
  };

  const updateEmployementType = async (data, id) => {
    try {
      const response = await updateEmployementTypeStatus(data, id);

      if (response.success) {
        toaster.success(response.message);
        getEmployementTypes();
        return true;
      } else {
        toaster.error(response.message);
        return false;
      }
    } catch (error) {
      //console.log(error)
      toaster.error(error?.response?.data?.error?.message || 'Something went wrong');
      return false;
    }
  };

  useEffect(() => {
    getEmployementTypes();
  }, []);

  return (
    <div className="bg-white border flex flex-col items-end">
      <Button className="m-3" onClick={handlePopup}>
        + Add Employement Type
      </Button>

      <TableComponent
        headers={['Employement Type', 'It Code', 'Status']}
        apiStatus={apiState.apiStatus}
        itemsLength={apiState?.data?.length}
        colSpan={3}
        containerStyle={{ maxHeight: '70vh', scrollbarWidth: 'none' }}
      >
        {getRows()}
      </TableComponent>

      <Popup open={openPopup} onClose={handlePopup} header="Add Employment Type">
        <EmployementTypeForm getEmployementTypes={getEmployementTypes} onClose={handlePopup} />
      </Popup>
    </div>
  );
};

export default EmployementTypes;
