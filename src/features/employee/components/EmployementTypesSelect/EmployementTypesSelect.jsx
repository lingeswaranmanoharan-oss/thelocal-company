import React, { useEffect, useMemo, useReducer } from 'react';
import { apiReducer, apiStatusConditions, initialState } from '../../../../utils/functions';
import { apiStatusConstants } from '../../../../utils/enum';
import { getEmployeTypes } from '../../services/services';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';

const EmployementTypesSelect = ({ onSelect, errorMsg, selectedValue }) => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);

  const getEmpTypes = async () => {
    try {
      apiDispatch({
        apiStatus: apiStatusConstants.inProgress,
      });
      const response = await getEmployeTypes({
        activeFlag: 'Y',
      });
      if (response.success === true) {
        apiDispatch({
          apiStatus: apiStatusConstants.success,
          payload: response?.data?.map((each) => ({ label: each.typeName, value: each.id })),
        });
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

  useEffect(() => {
    getEmpTypes();
  }, []);

  return (
    <Dropdown
      label="Employee Type"
      items={apiState.data}
      onSelect={onSelect}
      isLoading={apiStatusConditions.inProgress(apiState)}
      error={errorMsg}
      selectedValue={selectedValue}
    />
  );
};

export default EmployementTypesSelect;
