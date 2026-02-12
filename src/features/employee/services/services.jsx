import apiEndpoints from '../../../services/apiEndPoints';
import apiServices from '../../../services/apiServices';
import HttpService from '../../../services/httpService';
import { getAuthTokenDetails, getClientStorage, getCompanyId } from '../../../utils/functions';

export const getEmployeTypes = async (query) => {
  const response = await HttpService.get(
    apiEndpoints.getEmployeTypes({ companyId: getCompanyId(), ...query }),
  );
  return response;
};

export const getDesignations = async (query) => {
  const response = await HttpService.get(apiEndpoints.getDesignations(getCompanyId(), query));
  return response;
};

export const getDepartments = async (query) => {
  const response = await HttpService.get(
    apiEndpoints.getDepartments({ companyId: getCompanyId(), ...query }),
  );
  return response;
};

export const onboardEmployee = async (data) => {
  const response = await HttpService.post(apiEndpoints.onboardEmployee, {
    ...data,
    companyId: getCompanyId(),
  });
  return response;
};
export const updateEmployeeApplicationStatus = async (data) => {
  const response = await HttpService.put(apiEndpoints.updateEmployeeProfileStatus, data);
  return response;
};
export const generateEmpDetails = async (data) => {
  const response = await HttpService.put(apiEndpoints.generateCompanyAddresses, data);
  return response;
};

import { useState } from 'react';

const StatusActionBox = ({ status, pathParams, handleUpdateStatus }) => {
  const [reason, setReason] = useState('');

  const onSubmit = () => {
    handleUpdateStatus({
      id: pathParams.companyId,
      employeeApplicationStatus: status === 'report' ? 'REPORTED' : 'APPROVED',
      rejectedReason: status === 'report' ? reason : '',
    });
  };

  return (
    <div className="flex flex-col gap-4 p-5 w-full max-w-md bg-white rounded-xl shadow-md">
      {/* Title */}
      <p className="text-gray-700 text-center font-medium">
        Are you sure you want to {status} status?
      </p>

      {/* Reason Field */}
      {status === 'report' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Reason</label>

          <textarea
            rows={4}
            placeholder="Enter reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="
              w-full
              border border-gray-300
              rounded-lg
              p-3
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-red-400
              resize-none
            "
          />
        </div>
      )}

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={status === 'report' && !reason.trim()}
          className={`
            px-5 py-2
            rounded-lg
            text-white
            font-medium
            transition
            ${
              status === 'report'
                ? 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
                : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {status === 'report' ? 'Report' : 'Approve'}
        </button>
      </div>
    </div>
  );
};

export default StatusActionBox;
