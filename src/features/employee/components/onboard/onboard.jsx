import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../../../components/Input/Input';
import { Dropdown } from '../../../../components/Dropdown/Dropdown';
import { Button } from '../../../../components/Button/Button';
import { useEffect, useReducer, useState } from 'react';
import { apiReducer, getClientStorage, initialState } from '../../../../utils/functions';
import { getEmployeTypes, onboardEmployee } from '../../services/services';
import { apiStatusConstants } from '../../../../utils/enum';
import EmployementTypesSelect from '../EmployementTypesSelect/EmployementTypesSelect';
import Designations from '../DesignationsSelect/Designations';
import DepartmentsSelect from '../DepartmentsSelect/DepartmentsSelect';
import toaster from '../../../../services/toasterService';
import ProfileImageUpload from '../../../../components/ProfileImageUpload/ProfileImageUpload';
import useRouteInformation from '../../../../hooks/useRouteInformation';

export const employeeFormFields = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    component: 'input',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    component: 'input',
  },
  // {
  //   name: 'employeeId',
  //   label: 'Employee Id',
  //   type: 'text',
  //   component: 'input',
  // },
  {
    name: 'personalEmail',
    label: 'Email',
    type: 'email',
    component: 'input',
  },
  {
    name: 'contactNumber',
    label: 'Mobile Number',
    type: 'tel',
    component: 'input',
  },
  {
    name: 'employmentTypeId',
    label: 'Employment Type',
    component: 'employmentTypeSelect',
  },
  {
    name: 'designationId',
    label: 'Designation',
    component: 'designationsSelect',
  },
  {
    name: 'departmentId',
    label: 'Department',
    component: 'departmentsSelect',
  },
];

export const employeeSchema = yup.object({
  // employeeId: yup.string().required('Employee ID is required'),
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  personalEmail: yup
    .string()
    .email('Enter a valid email address')
    .required('Personal email is required'),
  contactNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .required('Contact number is required'),
  employmentTypeId: yup.string().required('Employment type is required'),
  departmentId: yup.string().required('Department is required'),
  designationId: yup.string().required('Designation is required'),
});

const EmployeeOnboardForm = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });
  const { navigateBack } = useRouteInformation();

  const onSubmit = async (data) => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await onboardEmployee(data);
      if (response.success === true) {
        setApiStatus(apiStatusConstants.success);
        toaster.success(response.message);
        navigateBack();
      } else {
        setApiStatus(apiStatusConstants.failure);
        toaster.error(response.message);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
      toaster.error(error.response.data?.error);
    }
  };

  const getFields = () => {
    return employeeFormFields.map((field) => {
      if (field.component === 'input') {
        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            {...register(field.name)}
            error={errors[field.name]?.message}
          />
        );
      }

      if (field.component === 'employmentTypeSelect') {
        return (
          <EmployementTypesSelect
            key={field.name}
            onSelect={(value) => setValue(field.name, value)}
            errorMsg={errors[field.name]?.message}
            selectedValue={watch(field.name)}
          />
        );
      } else if (field.component === 'designationsSelect') {
        return (
          <Designations
            key={field.name}
            onSelect={(value) => setValue(field.name, value)}
            errorMsg={errors[field.name]?.message}
            selectedValue={watch(field.name)}
          />
        );
      } else if (field.component === 'departmentsSelect') {
        return (
          <DepartmentsSelect
            key={field.name}
            onSelect={(value) => setValue(field.name, value)}
            errorMsg={errors[field.name]?.message}
            selectedValue={watch(field.name)}
          />
        );
      }

      return null;
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 border flex flex-col items-start"
    >
      {/* <ProfileImageUpload onChange={(value) => setValue('image', value)} value={watch('image')} />
      <br /> */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">{getFields()}</section>
      <div className="w-full flex justify-end gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={navigateBack}
          disabled={apiStatus === apiStatusConstants.inProgress}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={apiStatus === apiStatusConstants.inProgress}
        >
          {apiStatus === apiStatusConstants.inProgress ? 'Creating...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeOnboardForm;
