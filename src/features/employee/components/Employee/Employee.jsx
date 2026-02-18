import { useEffect, useReducer, useState } from 'react';
import {
  apiReducer,
  getClientStorage,
  getCompanyId,
  initialState,
} from '../../../../utils/functions';
import apiServices from '../../../../services/apiServices';
import apiEndpoints from '../../../../services/apiEndPoints';
import { apiStatusConstants, EmployeeTypes } from '../../../../utils/enum';
import { TableComponent, TableRow } from '../../../../components/Table/Table';
import { Button, ViewIconButton } from '../../../../components/Button/Button';
import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import useRouteInformation from '../../../../hooks/useRouteInformation';
import toaster from '../../../../services/toasterService';
import Popup from '../../../../components/Popup/Popup';
import { generateEmpDetails, getEmployeeSalary } from '../../services/services';
import AddSalaryPopup from './AddSalaryPopup';
import { Input } from '../../../../components/Input/Input';
import DateInput from '../../../../components/DateInput/DateInput';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const employeeSchema = yup.object({
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .min(3, 'Employee ID must be at least 3 characters')
    .max(15, 'Employee ID must be at most 15 characters')
    .matches(/^\S+$/, 'Employee ID must not contain spaces'),
  companyEmail: yup.string().email('Invalid email address').required('Company email is required'),
  dateOfJoining: yup.date().required('Date of joining is required').typeError('Invalid date'),
});

const EmployeeEdit = ({ getEmployees, empId }) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      employeeId: null,
      companyEmail: null,
      dateOfJoining: null,
    },
  });
  const onSubmit = async (formData) => {
    try {
      const response = await generateEmpDetails({ ...formData, id: empId });
      if (response.success === true) {
        setApiStatus(apiStatusConstants.success);
        toaster.success(response.message);
        getEmployees();
      } else {
        setApiStatus(apiStatusConstants.failure);
        toaster.error(response.message);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      toaster.error(error?.response?.data?.error);
    }
  };

  const handleDateInput = (values) => {
    setValue('dateOfJoining', values);
    trigger('dateOfJoining');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-4 p-5 w-full">
          <Input
            label="Employee Id"
            {...register('employeeId')}
            error={errors?.employeeId?.message}
          />
          <Input
            label="Company Email"
            {...register('companyEmail')}
            error={errors?.companyEmail?.message}
          />
          <DateInput
            label="Joining Date"
            format="DD-MM-YYYY"
            placeholder="Select DOB"
            value={watch('dateOfJoining')}
            handleChange={handleDateInput}
            error={errors?.dateOfJoining?.message}
          />

          <div className="flex justify-end">
            <Button
              onClick={onSubmit}
              type="submit"
              disabled={apiStatusConstants.inProgress === apiStatus}
            >
              {apiStatusConstants.inProgress === apiStatus ? 'Loading...' : 'Save'}{' '}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

const EachEmployeeRow = ({ each, pathname, names, getEmployees }) => {
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [salaryPopup, setSalaryPopup] = useState(false);
  const [salaryInitialData, setSalaryInitialData] = useState(null);

  const handleOpenAddSalary = async () => {
    let data = null;
    try {
      const response = await getEmployeeSalary(each.id);
      if (response?.success) {
        data = response?.data;
      }
    } catch {
      data = null;
    }
    setSalaryInitialData(data);
    setSalaryPopup(true);
  };

  const handleCloseSalaryPopup = () => {
    setSalaryPopup(false);
    setSalaryInitialData(null);
  };

  return (
    <>
      <TableRow
        elements={[
          each.id,
          pathname.includes('approved') &&
            (each.employeeId ? (
              each.employeeId
            ) : (
              <p
                style={{ margin: 0, color: 'orange', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => setConfirmPopup(true)}
              >
                Pending
              </p>
            )),
          each.firstName + ' ' + each.lastName,
          each.personalEmail,
          each.contactNumber,
          !pathname.includes('pending') && (
            <div className="flex items-center gap-1">
              <ViewIconButton
                requestedPath={`/employees/${names[2]}/viewEmployeeDetails/${each.id}`}
              />
              <IconButton
                onClick={handleOpenAddSalary}
                title="Add Salary"
                aria-label="Add Salary"
                size="small"
              >
                <Icon icon="mdi:cash-plus" color="#f26522" height={22} />
              </IconButton>
            </div>
          ),
        ]}
        key={each.id}
      />

      {confirmPopup && (
        <Popup open={confirmPopup} onClose={setConfirmPopup} header={'Update'}>
          <EmployeeEdit
            setConfirmPopup={setConfirmPopup}
            getEmployees={getEmployees}
            empId={each.id}
          />
        </Popup>
      )}

      {salaryPopup && (
        <Popup
          open={salaryPopup}
          onClose={handleCloseSalaryPopup}
          header="Salary Break Up"
          maxWidth="sm"
        >
          <AddSalaryPopup
            employeeId={each.id}
            onClose={handleCloseSalaryPopup}
            onSuccess={() => {
              getEmployees();
              handleCloseSalaryPopup();
            }}
            initialData={salaryInitialData}
          />
        </Popup>
      )}
    </>
  );
};

const Employee = () => {
  const [apiState, apiDispatch] = useReducer(apiReducer, initialState);
  const { queryParams, setQueryParams, pathname } = useRouteInformation();
  const names = pathname.split('/');
  const getEmployees = () => {
    apiServices.getService({
      apiUrl: apiEndpoints.getEmployees(getCompanyId(), {
        employeeApplicationStatus: pathname.includes('pending')
          ? EmployeeTypes.initiated
          : pathname.includes('approved')
            ? EmployeeTypes.approved
            : pathname.includes('requested')
              ? EmployeeTypes.pending
              : EmployeeTypes.reported,
        page: queryParams.page || 0,
        size: queryParams.size || 10,
      }),
      apiDispatch,
    });
  };
  const getRows = () =>
    apiState?.data?.data?.content?.map((each) => {
      return (
        <EachEmployeeRow
          each={each}
          pathname={pathname}
          names={names}
          getEmployees={getEmployees}
        />
      );
    });

  useEffect(getEmployees, [pathname, queryParams.size, queryParams.page]);

  return (
    <div className="bg-white border flex flex-col items-end">
      {pathname.includes('pending') && (
        <Link to={'/employees/pending/add-employee'}>
          <Button className="m-3">+ Add Employee</Button>
        </Link>
      )}

      <TableComponent
        apiState={apiState}
        headers={[
          'Id',
          pathname.includes('approved') && 'Employee ID',
          'Employee Name',
          'Email',
          'Mobile Number',
          !pathname.includes('pending') && 'ACT',
        ]}
        colSpan={!pathname.includes('pending') ? 5 : 4}
        onPageChange={(value) => setQueryParams({ page: value })}
        onItemsPerPageChange={(value) => setQueryParams({ size: value })}
        totalPages={apiState?.data?.data?.totalPages}
        currentPage={queryParams.page || 0}
        totalElements={apiState?.data?.data?.totalElements}
        itemsLength={apiState?.data?.data?.content?.length}
        pageSize={queryParams.size}
      >
        {getRows()}
      </TableComponent>
    </div>
  );
};

export default Employee;
