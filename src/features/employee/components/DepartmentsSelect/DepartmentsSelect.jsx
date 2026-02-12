import { useEffect, useReducer } from 'react';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import { apiReducer, apiStatusConditions, initialState } from '../../../../utils/functions';
import { apiStatusConstants } from '../../../../utils/enum';
import { getDepartments } from '../../services/services';

const DepartmentsSelect = ({ onSelect, errorMsg, selectedValue }) => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);

  useEffect(() => {
    const get = async () => {
      try {
        apiDispatch({
          apiStatus: apiStatusConstants.inProgress,
        });
        const response = await getDepartments({
          activeFlag: 'Y',
        });
        if (response.success === true) {
          apiDispatch({
            apiStatus: apiStatusConstants.success,
            payload: response?.data?.map((each) => ({
              label: each.departmentName,
              value: each.id,
            })),
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
    get();
  }, []);

  return (
    <Dropdown
      label="Department"
      items={apiState.data}
      onSelect={onSelect}
      isLoading={apiStatusConditions.inProgress(apiState)}
      error={errorMsg}
      selectedValue={selectedValue}
    />
  );
};

export default DepartmentsSelect;
