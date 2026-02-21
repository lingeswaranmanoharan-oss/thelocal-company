import React, { useEffect, useMemo, useReducer, useState } from 'react';
import DesignationForm from './DesignationForm';
import { TableComponent, TableRow } from '../../../../components/Table/Table';
import { apiStatusConstants } from '../../../../utils/enum';
import { getDesignations } from '../../../employee/services/services';
import { apiReducer, initialState } from '../../../../utils/functions';
import { Button } from '../../../../components/Button/Button';
import Popup from '../../../../components/Popup/Popup';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { updateDesignationStatus } from '../../services/services';
import toaster from '../../../../services/toasterService';

const EachRow = React.memo(({ each, getdesignations }) => {
  const [checked, setChecked] = useState(each.activeFlag === 'Y');

  const handleToggle = async (e) => {
    const { id, checked } = e.target;
    setChecked(checked);

    const updatedBody = { ...each, activeFlag: checked ? 'Y' : 'N' };

    try {
      const response = await updateDesignationStatus(updatedBody, id);
      if (response.success) {
        console.log(response);
        toaster.success(response?.message);
        getdesignations();
      } else {
        toaster.error('something wrong');
      }
    } catch (error) {
      console.log(error);
      toaster.error(error?.message);
    }
  };

  return (
    <TableRow
      elements={[
        each.designationName,
        <Toggle id={each.id} checked={checked} onChange={handleToggle} />,
      ]}
    />
  );
});

const Designations = () => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);
  const [openPopup, setOpenPopup] = useState(false);

  const handlePopup = () => setOpenPopup((prev) => !prev);

  const getdesignations = async () => {
    try {
      apiDispatch({
        apiStatus: apiStatusConstants.inProgress,
      });
      const response = await getDesignations();
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
    return sortedData.map((row) => (
      <EachRow key={row.id} each={row} getdesignations={getdesignations} />
    ));
  };

  useEffect(() => {
    getdesignations();
  }, []);

  return (
    <div className="bg-white border flex flex-col items-end">
      <Button className="m-3" onClick={handlePopup}>
        + Add Designation
      </Button>

      <TableComponent
        headers={['Designation Name', 'Status']}
        apiStatus={apiState?.apiStatus}
        itemsLength={apiState?.data?.length}
        colSpan={2}
        containerStyle={{ maxHeight: '70vh', scrollbarWidth: 'none' }}
      >
        {getRows()}
      </TableComponent>

      <Popup open={openPopup} onClose={handlePopup} header="Add Designation">
        <DesignationForm getdesignations={getdesignations} onClose={handlePopup} />
      </Popup>
    </div>
  );
};

export default Designations;
