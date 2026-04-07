import { useCallback, useEffect, useReducer } from 'react';
import { apiReducer, apiStatusConditions, initialState } from '../../../../utils/functions';
import { getEmployeeSalary } from '../../services/services';
import Loader from '../Loader/Loader';
import { ApiFailure } from '../../../../components/ApiFailure/ApiFailure';
import Accordion from '../../../../components/Accordion/Accordion';
import useRouteInformation from '../../../../hooks/useRouteInformation';
import { icons } from '../../../../Utils/constants';
import { apiStatusConstants } from '../../../../Utils/enum';

const Row = ({
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
  rupeeNotReq,
}) => (
  <div className={`flex items-center justify-between border-b border-gray-100 py-2 ${className}`}>
    <span className={`text-gray-600 ${labelClassName}`}>{label}</span>
    <span className={`text-gray-800 font-medium ${valueClassName}`}>
      {!rupeeNotReq && '₹'}
      {value}
    </span>
  </div>
);

const SalaryDetails = () => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);
  const { pathParams } = useRouteInformation();

  const getSalaryDetails = useCallback(async () => {
    apiDispatch({
      apiStatus: apiStatusConstants.inProgress,
    });
    try {
      const response = await getEmployeeSalary(pathParams.companyId);
      if (response?.success) {
        apiDispatch({
          apiStatus: apiStatusConstants.success,
          payload: response.data,
        });
      } else {
        apiDispatch({
          apiStatus: apiStatusConstants.failure,
          payload: response.data,
        });
      }
    } catch (err) {
      const message = err?.data?.error?.message;
      apiDispatch({
        apiStatus: apiStatusConstants.failure,
        payload: message,
      });
    }
  }, []);

  useEffect(() => {
    getSalaryDetails();
  }, []);

  console.log(apiState);

  const getContent = () => {
    if (apiStatusConditions.inProgress(apiState)) {
      return <Loader />;
    } else if (apiStatusConditions.failure(apiState)) {
      return <ApiFailure callBackFunction={getSalaryDetails} />;
    }
    const details = apiState?.data;

    return (
      <div className="bg-white w-full">
        <div className="flex items-start justify-between">
          <h2 className="text-sm tracking-widest text-gray-500 font-semibold">SALARY DETAILS</h2>

          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase">Total CTC</p>
            <p className="text-2xl font-semibold text-gray-800">₹ {details?.ctc}</p>
          </div>
        </div>

        <div className="gap-x-16 gap-y-5 text-sm">
          <Row label="Basic" value={details?.basicMonthly} />
          <Row label="HRA" value={details?.hraMonthly} />
          <Row label="Conveyance" value={details?.conveyanceMonthly} />
          <Row label="LTA" value={details?.ltaMonthly} />
          <Row label="Food Allowance" value={details?.foodMonthly} />
          <Row
            label="Gross Salary"
            value={details?.grossMonthly}
            className="text-lg"
            labelClassName="font-medium"
          />
          <Row
            label="(-) Deductions"
            value=""
            rupeeNotReq
            className="text-[15px]"
            labelClassName="!text-gray-500 font-medium"
          />
          <Row label="Employee PF" value={details?.employeePfMonthly} />
          <Row label="Employee ESIC" value={details?.employeeEsicMonthly} />
          <Row label="Professional Tax" value={details?.professionalTaxMonthly} />
        </div>
        <Row
          label="Net Salary"
          value={details?.takeHomeMonthly || 0}
          className="!border-b-0"
          labelClassName="!text-[var(--hrm-primary)]"
          valueClassName="!text-[var(--hrm-primary)]"
        />
      </div>
    );
  };

  return (
    <Accordion title="Salary" startIcon={icons.salary}>
      {getContent()}
    </Accordion>
  );
};

export default SalaryDetails;
