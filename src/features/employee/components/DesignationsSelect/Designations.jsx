import { useEffect, useReducer } from 'react';
import { apiStatusConstants } from '../../../../utils/enum';
import { apiReducer, apiStatusConditions, initialState } from '../../../../utils/functions';
import { getDesignations } from '../../services/services';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';

const Designations = ({ onSelect, errorMsg, selectedValue }) => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);

  useEffect(() => {
    const get = async () => {
      try {
        apiDispatch({
          apiStatus: apiStatusConstants.inProgress,
        });
        const response = await getDesignations({
          activeFlag: 'Y',
        });
        if (response.success === true) {
          apiDispatch({
            apiStatus: apiStatusConstants.success,
            payload: response?.data?.map((each) => ({
              label: each.designationName,
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
      label="Designation"
      items={apiState.data}
      onSelect={onSelect}
      isLoading={apiStatusConditions.inProgress(apiState)}
      error={errorMsg}
      selectedValue={selectedValue}
    />
  );
};

export default Designations;
