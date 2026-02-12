import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useReducer, useState } from 'react';
import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Toggle } from '../../../../components/Toggle/Toggle';
import { createDesignation } from '../../services/services';
import { apiStatusConstants } from '../../../../utils/enum';
import toaster from '../../../../services/toasterService';
import { apiReducer, initialState } from '../../../../utils/functions';
import { getDesignations } from '../../../employee/services/services';
import { TableComponent, TableRow } from '../../../../components/Table/Table';

const schema = yup.object({
  designationName: yup.string().required('Designation Name is required'),
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

const DesignationForm = ({ getdesignations, onClose }) => {
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
      const response = await createDesignation(data);
      console.log(response);
      if (response.success === true) {
        setApiStatus(apiStatusConstants.success);
        toaster.success(response.message);
        reset();
        getdesignations();
      } else {
        setApiStatus(apiStatusConstants.failure);
        toaster.error(response.message);
      }
    } catch (error) {
      console.log(error.response.data?.error);
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
            label="Designation Name"
            {...register('designationName')}
            error={errors.designationName?.message}
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

export default DesignationForm;
