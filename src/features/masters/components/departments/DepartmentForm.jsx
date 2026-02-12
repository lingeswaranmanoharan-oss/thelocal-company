import React, { useEffect, useReducer, useState } from 'react';
import * as yup from 'yup';
import { Input } from '../../../../components/Input/Input';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { apiStatusConstants } from '../../../../utils/enum';
import { createDepartment } from '../../services/services';
import toaster from '../../../../services/toasterService';
import { apiReducer, initialState } from '../../../../utils/functions';
import { getDepartments } from '../../../employee/services/services';
import { TableComponent, TableRow } from '../../../../components/Table/Table';

const schema = yup.object({
  departmentName: yup.string().required('Department Name is required'),
  activeFlag: yup
    .mixed()
    .transform((value) => {
      if (value === true) return 'Y';
      if (value === false) return 'N';
      return value;
    })
    .oneOf(['Y', 'N'])
    .notRequired(),
});

const DepartmentForm = ({ getDepts, onClose }) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      activeFlag: 'Y',
    },
  });

  const onSubmit = async (data) => {
    setApiStatus(apiStatusConstants.inProgress);
    try {
      const response = await createDepartment(data);
      console.log(response);
      if (response.success === true) {
        setApiStatus(apiStatusConstants.success);
        toaster.success(response.message);
        reset();
        getDepts();
      } else {
        setApiStatus(apiStatusConstants.failure);
        toaster.error(response.message);
      }
    } catch (error) {
      // console.log(error.response.data?.error)
      setApiStatus(apiStatusConstants.failure);
      toaster.error(error.response.data?.error?.message);
    }
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 border">
        <section className="flex flex-wrap gap-3 mb-4">
          <Input
            label="Department Name"
            {...register('departmentName')}
            error={errors.departmentName?.message}
          />
          <Toggle
            label="Status"
            error={errors.activeFlag?.message}
            onChange={(e) => setValue('activeFlag', e.target.checked ? 'Y' : 'N')}
            checked={watch('activeFlag') === 'Y'}
          />
        </section>
        <div className="flex">
          <Button
            type="submit"
            className="ml-auto"
            disabled={apiStatus === apiStatusConstants.inProgress}
          >
            {apiStatus === apiStatusConstants.inProgress ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default DepartmentForm;
